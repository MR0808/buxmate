import type { Metadata } from 'next';

import SiteBreadcrumb from '@/components/Global/SiteBreadcrumb';
import { authCheck } from '@/lib/authCheck';
import SettingsMain from '@/components/Settings/SettingsMain';
import {
    getAllCountries,
    getCountryByName,
    getStatesByCountry,
    getStateById,
    getCountryById
} from '@/lib/location';

import siteMetadata from '@/utils/siteMetaData';

export function generateMetadata(): Metadata {
    const title = 'Settings';
    const description =
        'Edit your personal details, as well as your security settings and other preferences.';
    const images = [siteMetadata.siteLogo];
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${siteMetadata.siteUrl}/settings`,
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

const SettingsPage = async () => {
    const userSession = await authCheck();
    const { user } = userSession;

    const countries = await getAllCountries();
    const defaultCountry = await getCountryByName('Australia');
    if (!defaultCountry) return null;
    const initialValueProp = user?.countryId ? true : false;
    const states = user?.countryId
        ? await getStatesByCountry(user.countryId)
        : await getStatesByCountry(defaultCountry.id);
    const country = user?.countryId
        ? await getCountryById(user.countryId)
        : await getCountryById(defaultCountry.id);
    const state = user?.countryId
        ? await getStateById(user.stateId || '')
        : await getStateById(defaultCountry.id);

    const location = {
        countries,
        defaultCountry,
        states,
        country,
        state,
        initialValueProp
    };

    return (
        <div>
            <SiteBreadcrumb />
            <div className="flex flex-row gap-20">
                <SettingsMain userSession={userSession} location={location} />
            </div>
        </div>
    );
};

export default SettingsPage;
