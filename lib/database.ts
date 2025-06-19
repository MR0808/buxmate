import { prisma } from '@/lib/prisma';
import type {
    User,
    OtpRecord,
    RateLimit,
    AuditLog,
    Prisma
} from '@/generated/prisma';

export type { User, OtpRecord, RateLimit, AuditLog };

export type CreateOtpRecordInput = {
    userId: string;
    email: string;
    newEmail: string;
    otp: string;
    expiresAt: Date;
};

export const db = {
    users: {
        findByEmail: async (email: string): Promise<User | null> => {
            return await prisma.user.findUnique({
                where: { email }
            });
        },

        updateEmail: async (
            userId: string,
            newEmail: string
        ): Promise<User | null> => {
            try {
                return await prisma.user.update({
                    where: { id: userId },
                    data: { email: newEmail }
                });
            } catch (error) {
                console.error('Error updating user email:', error);
                return null;
            }
        }
    },

    otpRecords: {
        create: async (data: CreateOtpRecordInput): Promise<OtpRecord> => {
            return await prisma.otpRecord.create({
                data
            });
        },

        findValid: async (
            userId: string,
            newEmail: string
        ): Promise<OtpRecord | null> => {
            return await prisma.otpRecord.findFirst({
                where: {
                    userId,
                    newEmail,
                    expiresAt: {
                        gt: new Date()
                    },
                    attempts: {
                        lt: 3
                    }
                }
            });
        },

        incrementAttempts: async (id: string): Promise<OtpRecord> => {
            return await prisma.otpRecord.update({
                where: { id },
                data: {
                    attempts: {
                        increment: 1
                    }
                }
            });
        },

        deleteByUserId: async (userId: string): Promise<void> => {
            await prisma.otpRecord.deleteMany({
                where: { userId }
            });
        },

        cleanup: async (): Promise<void> => {
            await prisma.otpRecord.deleteMany({
                where: {
                    expiresAt: {
                        lte: new Date()
                    }
                }
            });
        }
    },

    rateLimits: {
        get: async (key: string): Promise<RateLimit | null> => {
            const record = await prisma.rateLimit.findUnique({
                where: { key }
            });

            if (record && record.resetTime <= new Date()) {
                // Reset expired rate limit
                return await prisma.rateLimit.update({
                    where: { key },
                    data: {
                        count: 0,
                        resetTime: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
                    }
                });
            }

            return record;
        },

        increment: async (key: string): Promise<RateLimit> => {
            return await prisma.rateLimit.upsert({
                where: { key },
                update: {
                    count: {
                        increment: 1
                    }
                },
                create: {
                    key,
                    count: 1,
                    resetTime: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
                }
            });
        },

        cleanup: async (): Promise<void> => {
            await prisma.rateLimit.deleteMany({
                where: {
                    resetTime: {
                        lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
                    }
                }
            });
        }
    },

    auditLogs: {
        create: async (
            data: Prisma.AuditLogUncheckedCreateInput
        ): Promise<AuditLog> => {
            return await prisma.auditLog.create({
                data
            });
        },

        findByUserId: async (
            userId: string,
            limit = 10
        ): Promise<AuditLog[]> => {
            return await prisma.auditLog.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: limit
            });
        },

        cleanup: async (daysToKeep = 90): Promise<void> => {
            await prisma.auditLog.deleteMany({
                where: {
                    createdAt: {
                        lt: new Date(
                            Date.now() - daysToKeep * 24 * 60 * 60 * 1000
                        )
                    }
                }
            });
        }
    }
};
