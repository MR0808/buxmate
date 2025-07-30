'use server';

import * as z from 'zod';
import { auth } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { InvitationStatus } from '@/generated/prisma';

import { RegisterSchema } from '@/schemas/register';
import { prisma } from '@/lib/prisma';
import {
    logUserRegistered,
    logEmailVerifyRequested
} from '@/actions/audit/audit-auth';
import { MergeResult } from '@/types/events';
import { generateOTP, sendEmailOTP } from '@/lib/otp';

export const registerInitial = async (
    values: z.infer<typeof RegisterSchema>
) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' };
    }

    const { name, lastName, email, password } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: 'An account with this email already exists.' };
        }

        const data = await auth.api.signUpEmail({
            body: {
                name,
                lastName,
                email,
                password,
                role: 'USER'
            }
        });

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.verification.create({
            data: {
                identifier: `email-otp:${data.user.id}`,
                value: otp,
                expiresAt
            }
        });

        await sendEmailOTP(email, otp, name);

        await logUserRegistered(data.user.id, {
            registrationMethod: 'email',
            emailVerified: false
        });

        await logEmailVerifyRequested(data.user.id, data.user.email);

        return { userId: data.user.id, error: null };
    } catch (err) {
        if (err instanceof APIError) {
            return { error: err.message };
        }

        return { error: 'Internal Server Error' };
    }
};

export async function mergeDuplicateInvitations(
    userId: string,
    email: string,
    phoneNumber?: string
): Promise<MergeResult> {
    const result: MergeResult = {
        mergedInvitations: 0,
        acceptedEvents: [],
        errors: []
    };

    try {
        // Find all pending invitations for this user's email and phone number
        const pendingInvitations = await prisma.eventInvitation.findMany({
            where: {
                AND: [
                    {
                        status: InvitationStatus.PENDING,
                        recipientId: null // Only unlinked invitations
                    },
                    {
                        OR: [
                            { email: email },
                            ...(phoneNumber
                                ? [{ phoneNumber: phoneNumber }]
                                : [])
                        ]
                    }
                ]
            },
            include: {
                event: {
                    select: {
                        id: true,
                        slug: true,
                        title: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' } // Keep the earliest invitation as primary
        });

        // Group invitations by event
        const invitationsByEvent = new Map<string, typeof pendingInvitations>();

        for (const invitation of pendingInvitations) {
            const eventId = invitation.eventId;
            if (!invitationsByEvent.has(eventId)) {
                invitationsByEvent.set(eventId, []);
            }
            invitationsByEvent.get(eventId)!.push(invitation);
        }

        // Process each event's invitations
        for (const [eventId, eventInvitations] of invitationsByEvent) {
            if (eventInvitations.length === 1) {
                // Single invitation - just link it to the user
                await prisma.eventInvitation.update({
                    where: { id: eventInvitations[0].id },
                    data: {
                        recipientId: userId,
                        status: InvitationStatus.ACCEPTED,
                        respondedAt: new Date()
                    }
                });

                result.acceptedEvents.push(eventInvitations[0].event.slug);
            } else if (eventInvitations.length > 1) {
                // Multiple invitations for the same event - merge them
                const primaryInvitation = eventInvitations[0]; // Keep the earliest one
                const duplicateInvitations = eventInvitations.slice(1);

                // Update the primary invitation
                await prisma.eventInvitation.update({
                    where: { id: primaryInvitation.id },
                    data: {
                        recipientId: userId,
                        status: InvitationStatus.ACCEPTED,
                        respondedAt: new Date(),
                        // Combine messages if they exist
                        message:
                            eventInvitations
                                .map((inv) => inv.message)
                                .filter(Boolean)
                                .join(' | ') || primaryInvitation.message
                    }
                });

                // Mark duplicate invitations as merged
                for (const duplicate of duplicateInvitations) {
                    await prisma.eventInvitation.update({
                        where: { id: duplicate.id },
                        data: {
                            status: InvitationStatus.MERGED,
                            mergedIntoId: primaryInvitation.id,
                            respondedAt: new Date()
                        }
                    });
                }

                result.mergedInvitations += duplicateInvitations.length;
                result.acceptedEvents.push(primaryInvitation.event.slug);
            }
        }

        return result;
    } catch (error) {
        result.errors.push(
            error instanceof Error
                ? error.message
                : 'Unknown error during merge'
        );
        return result;
    }
}
