import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { createAuthMiddleware, APIError } from 'better-auth/api';

import { normalizeName } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/argon2';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql' // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        password: {
            hash: hashPassword,
            verify: verifyPassword
        },
        autoSignIn: false
    },
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === '/sign-up/email') {
                return {
                    context: {
                        ...ctx,
                        body: {
                            ...ctx.body,
                            name: normalizeName(ctx.body.name)
                        }
                    }
                };
            }
        })
    },
    advanced: {
        database: {
            generateId: false
        }
    },
    session: {
        expiresIn: 30 * 24 * 60 * 60,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60
        }
    },
    plugins: [nextCookies()]
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN';
