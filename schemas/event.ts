import * as z from 'zod';

export const CreateEventSchema = z.object({
    // Step 1: Basic Information
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().min(2, 'Description must be at least 2 characters'),
    date: z.coerce
        .date()
        .refine((date) => !isNaN(date.getTime()), { message: 'Invalid date' }),
    image: z
        .array(z.object({ value: z.custom<File>() }))
        .min(1, { message: 'Please add at least one image.' })
        .max(1, { message: 'You can only have one image' }),

    // Step 2: Logistical Information
    state: z.string().min(2, 'State is required'),
    timezone: z.string().min(1, 'Timezone is required'),
    currency: z.string().min(1, 'Timezone is required')
});

export const CreateEventSchemaImage = z.object({
    // Step 1: Basic Information
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().min(2, 'Description must be at least 2 characters'),
    date: z.coerce
        .date()
        .refine((date) => !isNaN(date.getTime()), { message: 'Invalid date' }),
    image: z.string().min(1, 'Event image is required'),

    // Step 2: Logistical Information
    state: z.string().min(2, 'State is required'),
    timezone: z.string().min(1, 'Timezone is required'),
    currency: z.string().min(1, 'Timezone is required')
});
