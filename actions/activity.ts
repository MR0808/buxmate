'use server';

import * as z from 'zod';
import GithubSlugger from 'github-slugger';

import { prisma } from '@/lib/prisma';
import { authCheckServer } from '@/lib/authCheck';
import { CreateActivitySchemaOutput } from '@/schemas/activity';

const slugger = new GithubSlugger();

const convertDollarsToCents = (dollarString: string): number => {
    const cleanValue = dollarString.replace('$', '');
    const dollars = Number.parseFloat(cleanValue);
    return Math.round(dollars * 100);
};

export const createActivity = async (
    values: z.infer<typeof CreateActivitySchemaOutput>,
    eventId: string
) => {
    const userSession = await authCheckServer();

    if (!userSession) {
        return {
            success: false,
            message: 'Not authorised'
        };
    }

    try {
        const event = await prisma.event.findUnique({ where: { id: eventId } });

        if (!event)
            return {
                success: false,
                message: 'Invalid event'
            };

        const validatedFields = CreateActivitySchemaOutput.safeParse(values);

        if (!validatedFields.success) {
            return {
                success: false,
                message: 'Invalid fields'
            };
        }

        if (event.date > values.startTime)
            return {
                success: false,
                message:
                    'Start time and date must be after the event start time'
            };

        const countryId = await prisma.country.findFirst({
            where: { isoCode: values.countryCode }
        });

        if (!countryId) {
            return {
                success: false,
                message: 'Invalid fields'
            };
        }

        let slug = slugger.slug(values.activityName);
        let slugExists = true;

        while (slugExists) {
            const checkSlug = await prisma.activity.findUnique({
                where: { slug }
            });
            if (!checkSlug) {
                slugExists = false;
                break;
            } else {
                slug = slugger.slug(values.activityName);
            }
        }

        const data = await prisma.activity.create({
            data: {
                slug,
                name: values.activityName,
                eventId,
                cost: convertDollarsToCents(values.cost),
                startTime: values.startTime,
                endTime: values.endTime,
                notes: values.notes || '',
                place: {
                    create: {
                        placeId: values.placeId,
                        name: values.displayName,
                        address1: values.address1,
                        address2: values.address2 || '',
                        city: values.city,
                        region: values.region,
                        postalCode: values.postalCode,
                        countryId: countryId.id,
                        formattedAddress: values.formattedAddress,
                        latitude: values.latitude,
                        longitude: values.longitude
                    }
                }
            },
            include: { place: true }
        });

        if (!data) {
            return {
                success: false,
                message: 'An error occurred while creating the activity'
            };
        }

        return {
            success: true,
            message: 'Activity successfully created',
            data
        };
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred while creating the activity'
        };
    }
};
