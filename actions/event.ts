'use server';

import * as z from 'zod';
import GithubSlugger from 'github-slugger';
import { InvitationStatus } from '@/generated/prisma';

import { prisma } from '@/lib/prisma';
import { authCheckServer } from '@/lib/authCheck';
import { ActionResult } from '@/types/global';
import {
    CreateEventSchemaOutput,
    AddGuestsValidate,
    AddGuestsSchema
} from '@/schemas/event';
import { validatePhoneNumber } from '@/utils/validatePhoneNumber';
import { InvitationResult, SendInvitationSMSProps } from '@/types/events';

const slugger = new GithubSlugger();

export const getImageUrl = async (id: string): Promise<ActionResult> => {
    const userSession = await authCheckServer();

    if (!userSession) {
        return {
            success: false,
            message: 'Not authorised'
        };
    }

    try {
        const image = await prisma.image.findUnique({ where: { id } });

        if (!image) {
            return {
                success: false,
                message: `Error - Image not found`
            };
        }

        return {
            success: true,
            message: 'Image successfully grabbed',
            data: image.image
        };
    } catch (error) {
        return {
            success: false,
            message: `Error - ${error}`
        };
    }
};

export const createEvent = async (
    values: z.infer<typeof CreateEventSchemaOutput>
) => {
    const userSession = await authCheckServer();

    if (!userSession) {
        return {
            success: false,
            message: 'Not authorised'
        };
    }

    const user = userSession.user;

    try {
        const validatedFields = CreateEventSchemaOutput.safeParse(values);

        if (!validatedFields.success) {
            return {
                success: false,
                message: 'Invalid fields'
            };
        }

        let slug = slugger.slug(values.title);
        let slugExists = true;

        while (slugExists) {
            const checkSlug = await prisma.event.findUnique({
                where: { slug }
            });
            if (!checkSlug) {
                slugExists = false;
                break;
            } else {
                slug = slugger.slug(values.title);
            }
        }

        const data = await prisma.event.create({
            data: {
                slug,
                date: values.date,
                title: values.title,
                description: values.description,
                image: values.image,
                stateId: values.state,
                currencyId: values.currency,
                hostId: userSession.user.id,
                timezone: values.timezone
            }
        });

        if (!data) {
            return {
                success: false,
                message: 'An error occurred while creating the event'
            };
        }

        await prisma.image.update({
            where: { id: values.image },
            data: { relatedEntity: data.id }
        });

        await prisma.invitation.create({
            data: {
                status: 'ACCEPTED',
                phoneNumber: user.phoneNumber || '',
                eventId: data.id,
                senderId: user.id,
                recipientId: user.id,
                inviteToken: generateInviteToken(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                recipientName: `${user.name} ${user.lastName}`
            }
        });

        return {
            success: true,
            message: 'Event successfully created',
            data
        };
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred while creating the event'
        };
    }
};

export const getEvent = async (slug: string) => {
    const userSession = await authCheckServer();

    if (!userSession) {
        return {
            success: false,
            message: 'Not authorised'
        };
    }
    try {
        const event = await prisma.event.findUnique({
            where: {
                slug
            },
            include: {
                state: {
                    select: {
                        id: true,
                        name: true,
                        country: { select: { id: true, name: true } }
                    }
                },
                currency: {
                    select: {
                        id: true,
                        code: true,
                        symbolNative: true,
                        numToBasic: true
                    }
                },
                host: {
                    select: {
                        id: true,
                        name: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        image: true
                    }
                },
                activities: {
                    include: { place: true },
                    orderBy: { startTime: 'asc' }
                },
                invitations: { include: { recipient: true } }
            }
        });

        if (!event) {
            return {
                success: false,
                message: 'No event exists'
            };
        }

        const image = event
            ? await prisma.image.findUnique({
                  where: {
                      id: event.image
                  },
                  select: {
                      id: true,
                      image: true,
                      imageName: true,
                      imageType: true,
                      relatedEntity: true,
                      bucket: true,
                      createdAt: true,
                      updatedAt: true
                  }
              })
            : null;

        const data = {
            ...event,
            image: image || null // Replace the image string with the full image object
        };

        return { success: true, message: 'Event retrieved', data };
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred while retrieving the event'
        };
    }
};

export const addGuests = async (
    values: z.infer<typeof AddGuestsSchema>,
    eventSlug: string
) => {
    const userSession = await authCheckServer();

    if (!userSession) {
        return {
            success: false,
            message: 'Not authorised',
            data: null,
            errors: null
        };
    }

    try {
        const event = await prisma.event.findUnique({
            where: { slug: eventSlug },
            select: { id: true, host: true, title: true }
        });

        if (!event) {
            return {
                success: false,
                message: 'Invalid event',
                data: null,
                errors: null
            };
        }

        const validatedFields = AddGuestsSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                success: false,
                message: 'Invalid fields',
                data: null,
                errors: null
            };
        }

        const phoneNumbersText = values.phoneNumbers || '';

        // Parse and validate phone numbers
        const phoneList = phoneNumbersText
            .split(/[,\n]+/)
            .map((phone) => phone.trim())
            .filter((phone) => phone.length > 0);

        const validPhoneNumbers: Array<{
            original: string;
            formatted: string;
            country?: string;
        }> = [];
        const invalidPhoneNumbers: string[] = [];

        phoneList.forEach((phone) => {
            const validation = validatePhoneNumber(phone);
            if (validation.isValid && validation.formatted) {
                validPhoneNumbers.push({
                    original: phone,
                    formatted: validation.formatted,
                    country: validation.country
                });
            } else {
                invalidPhoneNumbers.push(phone);
            }
        });

        const uniquePhoneNumbers = Array.from(
            new Set(validPhoneNumbers.map((phone) => phone.formatted)),
            (formatted) =>
                validPhoneNumbers.find((phone) => phone.formatted === formatted)
        );

        const validatedData = AddGuestsValidate.parse({
            validPhoneNumbers:
                uniquePhoneNumbers.length > 0 ? uniquePhoneNumbers : undefined,
            invalidPhoneNumbers:
                invalidPhoneNumbers.length > 0 ? invalidPhoneNumbers : undefined
        });

        const validPhoneCount = validatedData.validPhoneNumbers?.length || 0;
        const invalidPhoneCount =
            validatedData.invalidPhoneNumbers?.length || 0;

        let message = `Successfully processed ${validPhoneCount} valid phone numbers`;

        if (invalidPhoneCount > 0) {
            message += `. Found ${invalidPhoneCount} invalid phone numbers`;
        }
        const senderId = event.host.id;

        const results: InvitationResult = {
            success: true,
            invitations: [],
            errors: []
        };

        for (const phoneNumber of validPhoneNumbers) {
            try {
                // Check if phone number belongs to a registered user
                const existingUser = await prisma.user.findUnique({
                    where: { phoneNumber: phoneNumber.formatted }
                });

                // Check if invitation already exists
                const existingInvitation = await prisma.invitation.findUnique({
                    where: {
                        phoneNumber_eventId: {
                            phoneNumber: phoneNumber.formatted,
                            eventId: event.id
                        }
                    },
                    include: { recipient: true }
                });

                if (existingInvitation) {
                    // Update existing invitation if it was declined or expired
                    if (existingInvitation.status === 'DECLINED') {
                        results.invitations.push({
                            phoneNumber: phoneNumber.formatted,
                            status: 'declined',
                            isRegisteredUser: !!existingUser,
                            invitation: existingInvitation
                        });
                    } else if (existingInvitation.status === 'EXPIRED') {
                        const updatedInvitation =
                            await prisma.invitation.update({
                                where: { id: existingInvitation.id },
                                data: {
                                    status: InvitationStatus.PENDING,
                                    sentAt: null,
                                    respondedAt: null,
                                    inviteToken: generateInviteToken()
                                },
                                include: { recipient: true }
                            });

                        results.invitations.push({
                            phoneNumber: phoneNumber.formatted,
                            status: 'expired',
                            isRegisteredUser: !!existingUser,
                            invitation: updatedInvitation
                        });
                    } else {
                        results.invitations.push({
                            phoneNumber: phoneNumber.formatted,
                            status: 'duplicate',
                            isRegisteredUser: !!existingUser,
                            invitation: existingInvitation
                        });
                    }
                    continue;
                }

                // Create new invitation
                const invitation = await prisma.invitation.create({
                    data: {
                        phoneNumber: phoneNumber.formatted,
                        eventId: event.id,
                        senderId,
                        recipientId: existingUser?.id,
                        inviteToken: generateInviteToken(),
                        expiresAt: new Date(
                            Date.now() + 30 * 24 * 60 * 60 * 1000
                        ) // 30 days
                    },
                    include: { recipient: true }
                });

                results.invitations.push({
                    phoneNumber: phoneNumber.formatted,
                    status: 'created',
                    isRegisteredUser: !!existingUser,
                    invitation
                });
            } catch (error) {
                results.errors.push(
                    `Failed to process ${phoneNumber}: ${error}`
                );
                results.success = false;
            }
        }

        const validOptions = ['created', 'expired'];

        for (const invitation of results.invitations) {
            if (validOptions.includes(invitation.status)) {
                const inviteInfo: SendInvitationSMSProps = {
                    invitation: {
                        id: invitation.invitation.id,
                        inviteToken: invitation.invitation.inviteToken!,
                        phoneNumber: invitation.invitation.phoneNumber
                    },
                    event: {
                        hostName: event.host.name,
                        hostLastName: event.host.lastName,
                        title: event.title
                    }
                };
                await sendInvitationSMS(inviteInfo);
            }
        }

        const data = {
            validatedData,
            summary: {
                validPhoneNumbers: validPhoneCount,
                invalidPhoneNumbers: invalidPhoneCount
            },
            results
        };

        return {
            success: true,
            message,
            data,
            error: null
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Validation failed',
                errors: error.issues,
                data: null
            };
        }

        return {
            success: false,
            message: 'An unexpected error occurred',
            errors: null,
            data: null
        };
    }
};

const generateInviteToken = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const sendInvitationSMS = async ({
    invitation,
    event
}: SendInvitationSMSProps) => {
    // Implement your SMS service integration here
    // Example with Twilio, AWS SNS, or similar service

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitation.inviteToken}`;
    const hostName = `${event.hostName} ${event.hostLastName}`.trim();
    const message = `${hostName} invited you to ${event.title}! View details and RSVP: ${inviteLink}`;

    // Send SMS logic here
    console.log(`Sending SMS to ${invitation.phoneNumber}: ${message}`);

    // Update invitation with SMS sent timestamp
    await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
            sentAt: new Date()
            // smsMessageId: messageId, // Store SMS provider message ID
        }
    });
};
