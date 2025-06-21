'use server';

import * as z from 'zod';
import { auth, ErrorCode } from '@/lib/auth';
import { APIError } from 'better-auth/api';

import { RegisterSchema } from '@/schemas/auth';
import { logUserRegistered } from '@/actions/audit/audit-auth';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' };
    }

    const { name, lastName, email, password } = validatedFields.data;

    try {
        const data = await auth.api.signUpEmail({
            body: {
                name,
                lastName,
                email,
                password,
                role: 'USER'
            }
        });

        await logUserRegistered(data.user.id, {
            registrationMethod: 'email',
            emailVerified: false
        });

        return { error: null };
    } catch (err) {
        if (err instanceof APIError) {
            return { error: err.message };
        }

        return { error: 'Internal Server Error' };
    }
};
