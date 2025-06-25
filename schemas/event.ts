import * as z from 'zod';

export const CreateEventSchema = z.object({
    // Step 1: Basic Information
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().min(2, 'Description must be at least 2 characters'),
    date: z.coerce
        .date()
        .refine((date) => !isNaN(date.getTime()), { message: 'Invalid date' }),
    image: z.string().min(1, 'Event image is required'),

    // Step 2: Logistical Information
    country: z.string().min(2, 'Country is required'),
    state: z.string().min(2, 'State is required'),
    timezone: z.string().min(1, 'Timezone is required'),
    currency: z.string().min(1, 'Currency is required')
});
