'use server';

import * as z from 'zod';

import { db } from '@/lib/database';
import { ActionResult } from '@/types/global';
import {
    ChangePhoneSchema,
    VerifyPhoneChangeOTPSchema
} from '@/schemas/security';
import { authCheckServer } from '@/lib/authCheck';
import { calculateCooldownSeconds } from '@/utils/ratelimit';
import { generateOTP } from '@/utils/otp';
import { sendSMS } from '@/lib/sms';

const RATE_LIMIT_MAX_ATTEMPTS = 3;
const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes

export const sendPhoneChangeOTP = async (
    values: z.infer<typeof ChangePhoneSchema>
): Promise<ActionResult> => {
    const userSession = await authCheckServer();

    if (!userSession) {
        return {
            success: false,
            message: 'Not authorised'
        };
    }

    try {
        const validatedFields = ChangePhoneSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                success: false,
                message: 'Invalid fields'
            };
        }

        const { currentPhoneNumber, newPhoneNumber } = validatedFields.data;

        if (currentPhoneNumber === newPhoneNumber) {
            return {
                success: false,
                message:
                    'New phone number must be different from current phone number'
            };
        }

        // Find user by current email
        const user = await db.users.findByPhoneNumber(currentPhoneNumber);
        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        // Check if new email is already taken
        const existingUser = await db.users.findByPhoneNumber(newPhoneNumber);
        if (existingUser) {
            return {
                success: false,
                message: 'Phone number is already in use'
            };
        }

        // Rate limiting
        const rateLimitKey = `phone_change:${user.id}`;
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
        await db.phoneChangeRecords.cleanup();
        await db.phoneChangeRecords.deleteByUserId(user.id);

        // Create new OTP record
        await db.phoneChangeRecords.create({
            userId: user.id,
            phoneNumber: currentPhoneNumber,
            newPhoneNumber,
            otp,
            expiresAt
        });

        // Send SMS
        const smsResult = await sendSMS(
            newPhoneNumber,
            `Your verification code for Buxmate is: ${otp}. This code will expire in 10 minutes.`
        );

        if (!smsResult.success) {
            return {
                success: false,
                message: 'Failed to send verification message'
            };
        }

        return {
            success: true,
            message: 'Verification code sent successfully! Check your phone.',
            data: {
                expiresIn: OTP_EXPIRY / 1000
            }
        };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return {
            success: false,
            message: 'An error occurred while sending the verification code'
        };
    }
};

export const verifyPhoneChangeOTP = async (
    values: z.infer<typeof VerifyPhoneChangeOTPSchema>
): Promise<ActionResult> => {
    try {
        const userSession = await authCheckServer();
        if (!userSession) {
            return {
                success: false,
                message: 'Not authorised'
            };
        }
        const user = userSession.user;

        const validatedFields = VerifyPhoneChangeOTPSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                success: false,
                message: 'Invalid fields'
            };
        }

        const { phoneNumber, otp } = validatedFields.data;

        // Find pending phone change
        const pendingChange = await prisma.pendingPhoneChange.findFirst({
            where: {
                userId: user.id,
                newPhone: phoneNumber,
                otpCode: otp,
                verified: false,
                expiresAt: { gt: new Date() }
            }
        });

        if (!pendingChange) {
            return {
                success: false,
                message: 'Invalid or expired verification code'
            };
        }

        // Update user's phone number
        await prisma.user.update({
            where: { id: user.id },
            data: { phoneNumber: pendingChange.newPhone }
        });

        // Mark as verified and clean up
        await prisma.pendingPhoneChange.delete({
            where: { id: pendingChange.id }
        });

        return { success: true, message: 'Phone number updated successfully' };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return {
            success: false,
            message: 'An error occurred while verifying the code'
        };
    }
};

export const cancelPhoneChange = async () => {
    try {
        const userSession = await authCheckServer();
        if (!userSession) {
            return {
                success: false,
                error: 'Not authorised'
            };
        }
        const user = userSession.user;

        await prisma.pendingPhoneChange.deleteMany({
            where: { userId: user.id }
        });

        return { success: true };
    } catch (error) {
        console.error('Error canceling phone change:', error);
        return { success: false, error: 'An error occurred' };
    }
};
