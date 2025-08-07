'use server';

import { prisma } from '@/lib/prisma';
import { authCheckServer } from '@/lib/authCheck';
import { success } from 'zod';

export const getInvitationByToken = async (token: string) => {
    try {
        const data = await prisma.invitation.findUnique({
            where: { inviteToken: token },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        date: true,
                        slug: true,
                        image: true,
                        timezone: true,
                        activities: true
                    }
                },
                sender: {
                    select: {
                        name: true,
                        lastName: true
                    }
                },
                recipient: true
            }
        });

        if (!data)
            return {
                success: false,
                message: `Error - invitation not found`
            };

        const image = await prisma.image.findUnique({
            where: { id: data.event.image }
        });

        return { success: true, data: { invitation: data, image } };
    } catch (error) {
        return {
            success: false,
            message: `Error - ${error}`
        };
    }
};

export const respondToInvitation = async ({
    inviteToken,
    response
}: {
    inviteToken: string;
    response: 'ACCEPTED' | 'DECLINED';
}) => {
    if (!inviteToken || !response) {
        return {
            success: false,
            message: 'Invite token and response are required'
        };
    }

    if (!['ACCEPTED', 'DECLINED'].includes(response)) {
        return {
            success: false,
            message: 'Invalid response. Must be ACCEPTED or DECLINED'
        };
    }

    try {
        const invitation = await prisma.invitation.findUnique({
            where: { inviteToken },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        date: true,
                        slug: true
                    }
                }
            }
        });

        if (!invitation) {
            return {
                success: false,
                message: 'Invitation not found'
            };
        }

        if (invitation.expiresAt && invitation.expiresAt < new Date()) {
            throw new Error('Invitation has expired');
        }

        // If user is responding and they're registered, link them to the invitation
        const updateData: any = {
            status: response,
            respondedAt: new Date()
        };

        const data = await prisma.invitation.update({
            where: { id: invitation.id },
            data: updateData,
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        date: true,
                        slug: true
                    }
                }
            }
        });

        return {
            success: true,
            invitation: data,
            message: `Invitation ${response.toLowerCase()} successfully`
        };
    } catch (error) {
        return {
            success: false,
            message: `Error - ${error}`
        };
    }
};
