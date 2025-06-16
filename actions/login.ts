'use server';

import * as z from 'zod';
import { auth, ErrorCode } from '@/lib/auth';
import { headers } from 'next/headers';
import { APIError } from 'better-auth/api';
import { redirect } from 'next/navigation';

import { LoginSchema } from '@/schemas/auth';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' };
    }

    const { email, password, rememberMe } = validatedFields.data;
    try {
        await auth.api.signInEmail({
            headers: await headers(),
            body: {
                email,
                password,
                rememberMe
            }
        });

        return { error: null };
    } catch (err) {
        if (err instanceof APIError) {
            const errCode = err.body ? (err.body.code as ErrorCode) : 'UNKNOWN';

            switch (errCode) {
                case 'EMAIL_NOT_VERIFIED':
                    redirect('/auth/verify?error=email_not_verified');
                default:
                    return { error: err.message };
            }
        }

        return { error: 'Internal Server Error' };
    }
};
