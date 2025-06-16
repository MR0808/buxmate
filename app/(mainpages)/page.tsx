import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import HomeMain from '@/components/Home/HomeMain';
import { auth } from '@/lib/auth';

const HomePage = async () => {
    const headerList = await headers();

    const session = await auth.api.getSession({
        headers: headerList
    });

    if (!session) redirect('/auth/login');

    return <HomeMain />;
};

export default HomePage;
