import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { createAuthMiddleware } from 'better-auth/api';
import { admin } from 'better-auth/plugins';
import { UserRole } from '@/generated/prisma';

import { normalizeName } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/argon2';
import { ac, roles } from '@/lib/permissions';
import { sendVerificationEmail, sendResetEmail } from '@/lib/mail';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql' // or "mysql", "postgresql", ...etc
    }),
    socialProviders: {
        google: {
            clientId: String(process.env.GOOGLE_CLIENT_ID),
            clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
            mapProfileToUser: (profile) => {
                return {
                    name: profile.given_name,
                    lastName: profile.family_name
                };
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        password: {
            hash: hashPassword,
            verify: verifyPassword
        },
        autoSignIn: false,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendResetEmail({
                email: user.email,
                link: url
            });
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 60 * 60,
        sendVerificationEmail: async ({ user, url }) => {
            const link = new URL(url);
            link.searchParams.set('callbackURL', '/auth/verify');
            await sendVerificationEmail({
                email: user.email,
                link: String(link)
            });
        }
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
    user: {
        additionalFields: {
            lastName: {
                type: 'string',
                required: true
            }
        }
    },
    session: {
        expiresIn: 30 * 24 * 60 * 60,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60
        }
    },
    plugins: [
        nextCookies(),
        admin({
            defaultRole: UserRole.USER,
            adminRoles: [UserRole.ADMIN],
            ac,
            roles
        })
    ]
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN';
