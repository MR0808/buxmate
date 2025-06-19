'use server';

import * as z from 'zod';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/database';
import { ActionResult } from '@/types/global';
import { ChangeEmailSchema, VerifyOtpSchema } from '@/schemas/security';
import { authCheckServer } from '@/lib/authCheck';
import { calculateCooldownSeconds, getClientInfo } from '@/utils/ratelimit';
import { generateOTP } from '@/utils/otp';
import { sendEmailVerificationOtpEmail } from '@/lib/mail';
import { AuditLogDetails } from '@/types/audit';

const RATE_LIMIT_MAX_ATTEMPTS = 3;
const OTP_EXPIRY = 10 * 60 * 1000; // 15 minutes

export const requestOTP = async (
    values: z.infer<typeof ChangeEmailSchema>
): Promise<ActionResult> => {
    const userSession = await authCheckServer();

    if (!userSession) {
        return {
            success: false,
            message: 'Not authorised'
        };
    }

    try {
        const validatedFields = ChangeEmailSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                success: false,
                message: 'Invalid fields'
            };
        }

        const { currentEmail, newEmail } = validatedFields.data;

        if (currentEmail === newEmail) {
            return {
                success: false,
                message: 'New email must be different from current email'
            };
        }

        // Find user by current email
        const user = await db.users.findByEmail(currentEmail);
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        // Check if new email is already taken
        const existingUser = await db.users.findByEmail(newEmail);
        if (existingUser) {
            return {
                success: false,
                message: 'Email address is already in use'
            };
        }

        // Rate limiting
        const rateLimitKey = `email_change:${user.id}`;
        const rateLimit = await db.rateLimits.get(rateLimitKey);

        if (rateLimit && rateLimit.count >= RATE_LIMIT_MAX_ATTEMPTS) {
            const cooldownTime = calculateCooldownSeconds(rateLimit.resetTime);
            return {
                success: false,
                message: 'Too many attempts. Please try again later.',
                cooldownTime
            };
        }

        // Increment rate limit
        await db.rateLimits.increment(rateLimitKey);

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + OTP_EXPIRY);

        // Clean up old OTP records
        await db.otpRecords.cleanup();
        await db.otpRecords.deleteByUserId(user.id);

        // Create new OTP record
        await db.otpRecords.create({
            userId: user.id,
            email: currentEmail,
            newEmail,
            otp,
            expiresAt
        });

        const emailSent = await sendEmailVerificationOtpEmail({
            email: newEmail,
            otp
        });

        if (emailSent.error) {
            return {
                success: false,
                message: 'Failed to send verification email'
            };
        }

        // Audit log
        const { ipAddress, userAgent } = await getClientInfo();
        const auditDetails: AuditLogDetails = {
            currentEmail,
            newEmail,
            otpSent: true
        };

        await db.auditLogs.create({
            userId: user.id,
            action: 'email_change_otp_requested',
            details: auditDetails,
            ipAddress,
            userAgent
        });

        return {
            success: true,
            message: 'Verification code sent successfully! Check your email.',
            data: {
                expiresIn: OTP_EXPIRY / 1000,
                maskedEmail: newEmail // Will be masked in the component
            }
        };
    } catch (error) {
        console.error('Error requesting OTP:', error);
        return {
            success: false,
            message: 'Internal server error'
        };
    }
};

export async function verifyOTP(
    values: z.infer<typeof VerifyOtpSchema>
): Promise<ActionResult> {
    const userSession = await authCheckServer();

    if (!userSession) {
        return {
            success: false,
            message: 'Not authorised'
        };
    }

    try {
        const validatedFields = VerifyOtpSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                success: false,
                message: 'Invalid fields'
            };
        }

        const { currentEmail, newEmail, otp } = validatedFields.data;

        // Find user
        const user = await db.users.findByEmail(currentEmail);
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        // Find valid OTP record
        const otpRecord = await db.otpRecords.findValid(user.id, newEmail);
        if (!otpRecord) {
            return {
                success: false,
                message: 'Invalid or expired verification code'
            };
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            // Increment attempts
            await db.otpRecords.incrementAttempts(otpRecord.id);

            const remainingAttempts = 3 - (otpRecord.attempts + 1);

            // Audit log for failed attempt
            const { ipAddress, userAgent } = await getClientInfo();
            const auditDetails: AuditLogDetails = {
                currentEmail,
                newEmail,
                remainingAttempts
            };

            await db.auditLogs.create({
                userId: user.id,
                action: 'email_change_otp_failed',
                details: auditDetails,
                ipAddress,
                userAgent
            });

            if (remainingAttempts <= 0) {
                await db.otpRecords.deleteByUserId(user.id);
                return {
                    success: false,
                    message:
                        'Too many failed attempts. Please request a new code.'
                };
            }

            return {
                success: false,
                message: `Invalid code. ${remainingAttempts} attempts remaining.`
            };
        }

        // Check if new email is still available
        const existingUser = await db.users.findByEmail(newEmail);
        if (existingUser && existingUser.id !== user.id) {
            return {
                success: false,
                message: 'Email address is no longer available'
            };
        }

        // Update user email
        const updatedUser = await db.users.updateEmail(user.id, newEmail);
        if (!updatedUser) {
            return {
                success: false,
                message: 'Failed to update email'
            };
        }

        // Clean up OTP record
        await db.otpRecords.deleteByUserId(user.id);

        // Audit log for successful change
        const { ipAddress, userAgent } = await getClientInfo();
        const auditDetails: AuditLogDetails = {
            oldEmail: currentEmail,
            newEmail,
            verificationMethod: 'otp'
        };

        await db.auditLogs.create({
            userId: user.id,
            action: 'email_changed',
            details: auditDetails,
            ipAddress,
            userAgent
        });

        // Revalidate any cached data
        revalidatePath('/');

        return {
            success: true,
            message: 'Email address updated successfully!',
            data: {
                newEmail
            }
        };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return {
            success: false,
            message: 'Internal server error'
        };
    }
}
