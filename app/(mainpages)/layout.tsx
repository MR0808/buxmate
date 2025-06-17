import { headers } from 'next/headers';

import NavMain from '@/components/Navigation/NavMain';
import { auth } from '@/lib/auth';

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headerList = await headers();

    const session = await auth.api.getSession({
        headers: headerList
    });

    return (
        <>
            <NavMain session={session} />
            <div className="min-h-screen bg-background">
                <main className="flex-1 px-6 md:px-20 py-6">{children}</main>
            </div>
        </>
    );
}
