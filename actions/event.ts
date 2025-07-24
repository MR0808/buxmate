'use server';

import * as z from 'zod';
import GithubSlugger, { slug } from 'github-slugger';

import { prisma } from '@/lib/prisma';
import { authCheckServer } from '@/lib/authCheck';
import { ActionResult } from '@/types/global';
import {
    CreateEventSchemaOutput,
    AddGuestsValidate,
    AddGuestsSchema
} from '@/schemas/event';
import { isValidEmail } from '@/utils/validateEmail';
import { validatePhoneNumber } from '@/utils/validatePhoneNumber';

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
                guests: { orderBy: { name: 'asc' } }
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

export const addGuests = async (values: z.infer<typeof AddGuestsSchema>) => {
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
        const validatedFields = AddGuestsSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                success: false,
                message: 'Invalid fields',
                data: null,
                errors: null
            };
        }

        const emailsText = values.emails || '';
        const phoneNumbersText = values.phoneNumbers || '';

        const emailList = emailsText
            .split(/[,\n]+/)
            .map((email) => email.trim())
            .filter((email) => email.length > 0);

        const validEmails: string[] = [];
        const invalidEmails: string[] = [];

        emailList.forEach((email) => {
            if (isValidEmail(email)) {
                validEmails.push(email);
            } else {
                invalidEmails.push(email);
            }
        });

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

        const uniqueEmails = [...new Set(validEmails)];
        const uniquePhoneNumbers = Array.from(
            new Set(validPhoneNumbers.map((phone) => phone.formatted)),
            (formatted) =>
                validPhoneNumbers.find((phone) => phone.formatted === formatted)
        );

        const validatedData = AddGuestsValidate.parse({
            validEmails: uniqueEmails.length > 0 ? uniqueEmails : undefined,
            invalidEmails: invalidEmails.length > 0 ? invalidEmails : undefined,
            validPhoneNumbers:
                uniquePhoneNumbers.length > 0 ? uniquePhoneNumbers : undefined,
            invalidPhoneNumbers:
                invalidPhoneNumbers.length > 0 ? invalidPhoneNumbers : undefined
        });

        const validEmailCount = validatedData.validEmails?.length || 0;
        const invalidEmailCount = validatedData.invalidEmails?.length || 0;
        const validPhoneCount = validatedData.validPhoneNumbers?.length || 0;
        const invalidPhoneCount =
            validatedData.invalidPhoneNumbers?.length || 0;

        let message = `Successfully processed ${validEmailCount} valid emails and ${validPhoneCount} valid phone numbers`;

        if (invalidEmailCount > 0 || invalidPhoneCount > 0) {
            message += `. Found ${invalidEmailCount} invalid emails and ${invalidPhoneCount} invalid phone numbers`;
        }

        const data = {
            validatedData,
            summary: {
                validEmails: validEmailCount,
                invalidEmails: invalidEmailCount,
                validPhoneNumbers: validPhoneCount,
                invalidPhoneNumbers: invalidPhoneCount
            }
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
