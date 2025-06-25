import type { Metadata } from 'next';

import HomeMain from '@/components/Home/HomeMain';
import { authCheck } from '@/lib/authCheck';
import siteMetadata from '@/utils/siteMetaData';

export function generateMetadata(): Metadata {
    const title = 'Dashboard';
    const description = 'Buxmate is here to make your next big night easy';
    const images = [siteMetadata.siteLogo];
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${siteMetadata.siteUrl}/`,
            siteName: siteMetadata.title,
            locale: 'en_AU',
            type: 'article',
            publishedTime: '2024-08-15 13:00:00',
            modifiedTime: '2024-08-15 13:00:00',
            images,
            authors: [siteMetadata.author]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images
        }
    };
}

const HomePage = async () => {
    const { user, session } = await authCheck();

    return <HomeMain />;
};

export default HomePage;
