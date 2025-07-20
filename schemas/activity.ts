import * as z from 'zod';

import { combineDateTime } from '@/utils/datetime';

export const CreateActivitySchema = z
    .object({
        activityName: z.string().min(2, 'Name must be at least 2 characters'),
        placeId: z.string().min(1, 'Place ID is required'),
        displayName: z.string().optional(),
        address1: z.string().min(1, 'Address line 1 is required'),
        address2: z.optional(z.string()),
        formattedAddress: z.string().min(1, 'Formatted address is required'),
        latitude: z.number({
            error: (issue) => {
                if (issue.code === 'invalid_type') {
                    return 'latitude must be a number';
                }

                return 'Latitude is required';
            }
        }),
        longitude: z.number({
            error: (issue) => {
                if (issue.code === 'invalid_type') {
                    return 'Longitude must be a number';
                }

                return 'Latitude is required';
            }
        }),
        city: z.string().min(1, 'City is required'),
        region: z.string().min(1, 'Region is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        country: z.string().min(1, 'Country is required'),
        countryCode: z.optional(z.string()),
        types: z.array(z.string()),
        businessStatus: z.optional(z.string()),
        // activityDate: z.string().min(1, 'Please select an event date'),
        activityDate: z.date(),
        startHour: z.string().min(1, 'Please select start hour'),
        startMinute: z.string().min(1, 'Please select start minute'),
        startPeriod: z.string().min(1, 'Please select AM or PM'),
        endHour: z.string().min(1, 'Please select end hour'),
        endMinute: z.string().min(1, 'Please select end minute'),
        endPeriod: z.string().min(1, 'Please select AM or PM'),
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
            // const eventDate = new Date(data.activityDate);
            const eventDate = data.activityDate;

            const startDateTime = combineDateTime(
                eventDate,
                data.startHour,
                data.startMinute,
                data.startPeriod
            );
            const endDateTime = combineDateTime(
                eventDate,
                data.endHour,
                data.endMinute,
                data.endPeriod
            );

            // If end time is earlier than start time, assume it's next day
            if (endDateTime <= startDateTime) {
                endDateTime.setDate(endDateTime.getDate() + 1);
            }

            return endDateTime > startDateTime;
        },
        {
            message: 'End time must be after start time',
            path: ['endPeriod']
        }
    );

export const CreateActivitySchemaOutput = z.object({
    activityName: z.string().min(2, 'Name must be at least 2 characters'),
    placeId: z.string().min(1, 'Place ID is required'),
    displayName: z.string().optional(),
    address1: z.string().min(1, 'Address line 1 is required'),
    address2: z.optional(z.string()),
    formattedAddress: z.string().min(1, 'Formatted address is required'),
    latitude: z.number({
        error: (issue) => {
            if (issue.code === 'invalid_type') {
                return 'latitude must be a number';
            }

            return 'Latitude is required';
        }
    }),
    longitude: z.number({
        error: (issue) => {
            if (issue.code === 'invalid_type') {
                return 'Longitude must be a number';
            }

            return 'Latitude is required';
        }
    }),
    city: z.string().min(1, 'City is required'),
    region: z.string().min(1, 'Region is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    countryCode: z.optional(z.string()),
    types: z.array(z.string()),
    busisnessStatus: z.optional(z.string()),
    startTime: z.date(),
    endTime: z.date(),
    notes: z.optional(z.string().min(2, 'Notes must be at least 2 characters')),
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
});
