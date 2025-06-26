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

export const CreateActivitySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    locationName: z
        .string()
        .min(2, 'Location name must be at least 2 characters'),
    address1: z.string().min(2, 'Address 1must be at least 2 characters'),
    address2: z.optional(
        z.string().min(2, 'Address 2 must be at least 2 characters')
    ),
    formattedAddress: z
        .string()
        .min(2, 'Formatted address must be at least 2 characters'),
    latitude: z.number({
        required_error: 'Latitude is required',
        invalid_type_error: 'Latitude must be a number'
    }),
    longitude: z.number({
        required_error: 'Longitude is required',
        invalid_type_error: 'Longitude must be a number'
    }),
    city: z.string().min(2, 'City must be at least 2 characters'),
    region: z.string().min(2, 'Region must be at least 2 characters'),
    postalCode: z.string().min(2, 'Postal code must be at least 2 characters'),
    country: z.string().min(2, 'Country must be at least 2 characters'),
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
