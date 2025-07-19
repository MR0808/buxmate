import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

export const authCheck = async (callbackUrl?: string) => {
    const headerList = await headers();

    const session = await auth.api.getSession({
        headers: headerList
    });

    if (!session) {
        if (callbackUrl) {
            return redirect(
                `/auth/login?callbackURL=${encodeURIComponent(callbackUrl)}`
            );
        } else {
            return redirect('/auth/login');
        }
    }

    return session;
};

export const authCheckServer = async () => {
    const headerList = await headers();

    const session = await auth.api.getSession({
        headers: headerList
    });

    if (!session) return false;

    return session;
};
