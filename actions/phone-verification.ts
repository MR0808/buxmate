'use server';

import { auth, ErrorCode } from '@/lib/auth';
import { headers } from 'next/headers';

import { prisma } from '@/lib/prisma';
import { generateOTP, sendSMSOTP, validatePhoneNumber } from '@/lib/otp';
import {
    logPhoneVerifyRequested,
    logPhoneVerified
} from '@/actions/audit/audit-auth';

export const addPhoneNumber = async (userId: string, phoneNumber: string) => {
    try {
        // Validate phone number format
        const validatedPhone = validatePhoneNumber(phoneNumber);
        if (!validatedPhone.isValid) {
            return {
                error: 'Please enter a valid phone number with country code.'
            };
        }

        // Check if phone number is already in use
        const existingUser = await prisma.user.findFirst({
            where: {
                phoneNumber: validatedPhone.formatted,
                id: { not: userId }
            }
        });

        if (existingUser) {
            return {
                error: 'This phone number is already registered to another account.'
            };
        }

        // Update user with phone number (but not verified yet)
        await prisma.user.update({
            where: { id: userId },
            data: { phoneNumber: validatedPhone.formatted }
        });

        // Generate and send SMS OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store OTP in verification table
        await prisma.verification.create({
            data: {
                identifier: `phone-otp:${userId}`,
                value: otp,
                expiresAt
            }
        });

        // Send SMS OTP
        const result = await sendSMSOTP(validatedPhone.formatted, otp);

        if (!result.success)
            return {
                error: 'Error sending message. Please try again'
            };

        await logPhoneVerifyRequested(userId, phoneNumber);

        return { success: true };
    } catch (error) {
        console.error('Add phone number error:', error);
        return { error: 'Failed to send SMS verification. Please try again.' };
    }
};

export const verifyPhoneOTP = async (
    userId: string,
    otp: string,
    email: string,
    password: string
) => {
    try {
        // Find the OTP verification record
        const verification = await prisma.verification.findFirst({
            where: {
                identifier: `phone-otp:${userId}`,
                value: otp,
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        if (!verification) {
            return { error: 'Invalid or expired verification code.' };
        }

        // Add phoneVerified field to user (you'll need to add this to your schema)
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                phoneVerified: true
            }
        });

        if (!user) return { error: 'Server error' };

        // Clean up the verification record
        await prisma.verification.delete({
            where: { id: verification.id }
        });

        await logPhoneVerified(userId, user.phoneNumber || '');

        if (user.phoneNumber)
            await prisma.invitation.updateMany({
                where: { phoneNumber: user.phoneNumber },
                data: { recipientId: user.id }
            });

        if (email && password) {
            await auth.api.signInEmail({
                headers: await headers(),
                body: {
                    email,
                    password,
                    rememberMe: true
                }
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Phone verification error:', error);
        return { error: 'Failed to verify phone number. Please try again.' };
    }
};

export const resendPhoneOTP = async (userId: string) => {
    try {
        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || !user.phoneNumber) {
            return { error: 'User or phone number not found.' };
        }

        // Delete any existing OTP
        await prisma.verification.deleteMany({
            where: {
                identifier: `phone-otp:${userId}`
            }
        });

        // Generate new OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store new OTP
        await prisma.verification.create({
            data: {
                identifier: `phone-otp:${userId}`,
                value: otp,
                expiresAt
            }
        });

        // Send new SMS OTP
        await sendSMSOTP(user.phoneNumber, otp);

        return { success: true };
    } catch (error) {
        console.error('Resend phone OTP error:', error);
        return { error: 'Failed to resend SMS code. Please try again.' };
    }
};
