import * as z from 'zod';

export const CreateEventSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().min(2, 'Description must be at least 2 characters'),
    eventDate: z.string().min(1, 'Please select an event date'),
    startHour: z.string().min(1, 'Please select hour'),
    startMinute: z.string().min(1, 'Please select minute'),
    startPeriod: z.string().min(1, 'Please select AM or PM'),
    image: z.string().min(1, 'Event image is required'),
    country: z.string().min(2, 'Country is required'),
    state: z.string().min(2, 'State is required'),
    timezone: z.string().min(1, 'Timezone is required'),
    currency: z.string().min(1, 'Currency is required')
});

export const CreateEventSchemaOutput = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().min(2, 'Description must be at least 2 characters'),
    date: z.date(),
    image: z.string().min(1, 'Event image is required'),
    country: z.string().min(2, 'Country is required'),
    state: z.string().min(2, 'State is required'),
    timezone: z.string().min(1, 'Timezone is required'),
    currency: z.string().min(1, 'Currency is required')
});

export const AddGuestsSchema = z.object({
    phoneNumbers: z.string()
});

export const AddGuestsValidate = z
    .object({
        validPhoneNumbers: z
            .array(
                z.object({
                    original: z.string(),
                    formatted: z.string(),
                    country: z.string().optional()
                })
            )
            .optional(),
        invalidPhoneNumbers: z.array(z.string()).optional()
    })
    .refine(
        (data) => {
            const hasValidPhones =
                data.validPhoneNumbers && data.validPhoneNumbers.length > 0;
            return hasValidPhones;
        },
        {
            message: 'Please provide at least one valid phone number',
            path: ['root']
        }
    );
