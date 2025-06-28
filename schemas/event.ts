import * as z from 'zod';

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

export const PlaceSchema = z.object({
    placeId: z.string().min(1, 'Place ID is required'),
    name: z.string().optional(),
    formattedAddress: z.string().min(1, 'Address is required'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    types: z.array(z.string()).default([]),
    streetNumber: z.string().optional(),
    route: z.string().optional(),
    locality: z.string().optional(),
    administrativeAreaLevel1: z.string().optional(),
    administrativeAreaLevel2: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional()
});

export const CreateActivitySchema = z.object({
    activityName: z.string().min(2, 'Name must be at least 2 characters'),
    placeId: z.string().min(1, 'Place ID is required'),
    placeName: z.string().optional(),
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
    startTime: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: 'Invalid start time'
    }),
    endTime: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: 'Invalid end time'
    }),
    notes: z.optional(z.string().min(2, 'Notes must be at least 2 characters')),
    cost: z.coerce
        .number()
        .int('Cost must be an integer')
        .nonnegative('Cost cannot be negative')
});

export type CreateActivityFormValues = z.infer<typeof CreateActivitySchema>;
