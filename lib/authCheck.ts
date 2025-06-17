import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

export const authCheck = async () => {
    const headerList = await headers();

    const session = await auth.api.getSession({
        headers: headerList
    });

    if (!session) return redirect('/auth/login');

    return session;
};
