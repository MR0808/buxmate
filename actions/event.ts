'use server';

import * as z from 'zod';
import GithubSlugger, { slug } from 'github-slugger';

import { prisma } from '@/lib/prisma';
import { authCheckServer } from '@/lib/authCheck';
import { ActionResult } from '@/types/global';
import { CreateEventSchema } from '@/schemas/event';

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
    values: z.infer<typeof CreateEventSchema>
) => {
    const userSession = await authCheckServer();

    if (!userSession) {
        return {
            success: false,
            message: 'Not authorised'
        };
    }

    try {
        const validatedFields = CreateEventSchema.safeParse(values);

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
        const data = await prisma.event.findUnique({
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
                activities: { orderBy: { startTime: 'asc' } },
                guests: { orderBy: { name: 'asc' } }
            }
        });

        if (!data) {
            return {
                success: false,
                message: 'No event exists'
            };
        }

        return { success: true, message: 'Event retrieved', data };
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred while retrieving the event'
        };
    }
};
