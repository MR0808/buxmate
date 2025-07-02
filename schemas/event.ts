import * as z from 'zod';

import { timeStringToDateTime, compareTimeOnly } from '@/utils/time';

export const CreateEventSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().min(2, 'Description must be at least 2 characters'),
    date: z.coerce
        .date()
        .refine((date) => !isNaN(date.getTime()), { message: 'Invalid date' }),
    image: z.string().min(1, 'Event image is required'),
    country: z.string().min(2, 'Country is required'),
    state: z.string().min(2, 'State is required'),
    timezone: z.string().min(1, 'Timezone is required'),
    currency: z.string().min(1, 'Currency is required')
});

// export const PlaceSchema = z.object({
//     placeId: z.string().min(1, 'Place ID is required'),
//     name: z.string().optional(),
//     formattedAddress: z.string().min(1, 'Address is required'),
//     latitude: z.number().min(-90).max(90),
//     longitude: z.number().min(-180).max(180),
//     types: z.array(z.string()).default([]),
//     streetNumber: z.string().optional(),
//     route: z.string().optional(),
//     locality: z.string().optional(),
//     administrativeAreaLevel1: z.string().optional(),
//     administrativeAreaLevel2: z.string().optional(),
//     country: z.string().optional(),
//     postalCode: z.string().optional()
// });

const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

export const timeSchema = z
    .string()
    .regex(timeRegex, 'Please enter a valid time in HH:MM AM/PM format');

export const CreateActivitySchema = z
    .object({
        activityName: z.string().min(2, 'Name must be at least 2 characters'),
        placeId: z.string().min(1, 'Place ID is required'),
        displayName: z.string().optional(),
        address1: z.string().min(1, 'Address line 1 is required'),
        address2: z.optional(z.string()),
        formattedAddress: z.string().min(1, 'Formatted address is required'),
        latitude: z.number({
            required_error: 'Latitude is required',
            invalid_type_error: 'Latitude must be a number'
        }),
        longitude: z.number({
            required_error: 'Longitude is required',
            invalid_type_error: 'Longitude must be a number'
        }),
        city: z.string().min(1, 'City is required'),
        region: z.string().min(1, 'Region is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        country: z.string().min(1, 'Country is required'),
        countryCode: z.optional(z.string()),
        types: z.array(z.string()),
        busisnessStatus: z.optional(z.string()),
        startTime: timeSchema,
        endTime: timeSchema,
        notes: z.optional(
            z.string().min(2, 'Notes must be at least 2 characters')
        ),
        cost: z
            .string()
            .min(1, 'Cost is required')
            .regex(
                /^\$?\d+(\.\d{1,2})?$/,
                'Please enter a valid dollar amount (e.g., $10.50 or 10.50)'
            )
            .refine((val) => {
                const cleanValue = val.replace('$', '');
                const dollars = Number.parseFloat(cleanValue);
                return dollars > 0;
            }, 'Cost must be greater than $0.00')
    })
    .refine(
        (data) => {
            // Convert time strings to DateTime and compare
            const startDateTime = timeStringToDateTime(data.startTime);
            const endDateTime = timeStringToDateTime(data.endTime);
            return compareTimeOnly(endDateTime, startDateTime) > 0;
        },
        {
            message: 'End time must be after start time',
            path: ['endTime']
        }
    );

// export type CreateActivityFormValues = z.infer<typeof CreateActivitySchema>;
