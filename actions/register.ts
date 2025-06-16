'use server';

import * as z from 'zod';
import { auth, ErrorCode } from '@/lib/auth';
import { APIError } from 'better-auth/api';

import { RegisterSchema } from '@/schemas/auth';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' };
    }

    const { name, lastName, email, password } = validatedFields.data;

    try {
        await auth.api.signUpEmail({
            body: {
                name,
                lastName,
                email,
                password
            }
        });

        return { error: null };
    } catch (err) {
        if (err instanceof APIError) {
            return { error: err.message };
        }

        return { error: 'Internal Server Error' };
    }
};
