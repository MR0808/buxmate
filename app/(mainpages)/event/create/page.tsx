import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import CreateEventForm from '@/components/Event/Create/CreateEventForm';
import { authCheck } from '@/lib/authCheck';
import siteMetadata from '@/utils/siteMetaData';
import { getAllCurrencies, getCurrencyByCode } from '@/actions/currencies';
import {
    getAllCountries,
    getCountryByName,
    getStatesByCountry,
    getCountryById
} from '@/lib/location';

export function generateMetadata(): Metadata {
    const title = 'Create Event';
    const description =
        'Buxmate is here to make your next big night easy, create your event now!';
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

const CreateEventPage = async () => {
    const userSession = await authCheck();
    const { data: currencies } = await getAllCurrencies();
    const { data: currency } = await getCurrencyByCode('AUD');
    const countries = await getAllCountries();
    const defaultCountry = await getCountryByName('Australia');
    if (!defaultCountry) return redirect('/admin/merchants/');
    const states = await getStatesByCountry(defaultCountry.id);
    const country = await getCountryById(defaultCountry.id);

    return (
        <div>
            <CreateEventForm
                currencies={currencies || []}
                defaultCurrency={currency}
                countryProp={country || defaultCountry!}
                countries={countries!}
                states={states!}
                userSession={userSession}
            />
        </div>
    );
};
export default CreateEventPage;
