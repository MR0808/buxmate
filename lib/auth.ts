import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { UserRole } from '@/generated/prisma';
import { admin, customSession, openAPI } from 'better-auth/plugins';

import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/argon2';
import { sendVerificationEmail, sendResetEmail } from '@/lib/mail';
import { ac, roles } from '@/lib/permissions';
import { listUserAccounts } from 'better-auth/api';
import { headers } from 'next/headers';

const options = {
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
        sendVerificationEmail: async ({ user, url }) => {
            const link = new URL(url);
            link.searchParams.set('callbackURL', '/auth/verify');
            await sendVerificationEmail({
                email: user.email,
                link: String(link)
            });
        }
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
            },
            role: {
                type: ['USER', 'ADMIN'] as Array<UserRole>,
                input: false
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
} satisfies BetterAuthOptions;

export const auth = betterAuth({
    ...options,
    plugins: [
        ...(options.plugins ?? []),
        customSession(async ({ user, session }) => {
            // const accounts = await listUserAccounts({
            //     headers: await headers()
            // });
            let hasGoogleAccount = false;
            // if (accounts) {
            //     hasGoogleAccount = accounts.some(
            //         (account) => account.provider === 'google'
            //     );
            // }
            return {
                session,
                user: {
                    ...user,
                    oauth: hasGoogleAccount
                }
            };
        }, options),
        openAPI()
    ]
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN';
