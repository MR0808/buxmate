'use server';

import { getGeolocation } from '@/utils/geolocation';
import { authCheckServer } from '@/lib/authCheck';
import { AddressType } from '@/types/places';

export const autocompleteFetch = async (input: string) => {
    const userSession = await authCheckServer();
    if (!userSession) {
        return {
            error: 'Not authorised',
            data: null
        };
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY as string;
    if (!apiKey) return { error: 'Missing API Key', data: null };
    if (!input) return { error: 'Error', data: null };

    const country = await getGeolocation();
    const url = 'https://places.googleapis.com/v1/places:autocomplete';

    const primaryTypes = [
        'street_address',
        'subpremise',
        'route',
        'street_number',
        'landmark'
    ];

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey
            },
            body: JSON.stringify({
                input: input,
                // includedPrimaryTypes: primaryTypes,
                // Location biased towards the user's country
                includedRegionCodes: [country || 'AU']
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return { data: data.suggestions, error: null };
    } catch (error) {
        // console.error("Error fetching autocomplete suggestions:", error);
        return { error: error, data: null };
    }
};

export const placesFetch = async (placeId: string) => {
    const userSession = await authCheckServer();
    if (!userSession) {
        return {
            error: 'Not authorised',
            data: null
        };
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY as string;
    if (!apiKey) return { error: 'Missing API Key', data: null };
    if (!placeId) return { error: 'Error', data: null };
    const url = `https://places.googleapis.com/v1/${placeId}`;

    try {
        const response = await fetch(url, {
            headers: {
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask':
                    // Include expected fields in the response
                    'id,name,types,displayName,adrFormatAddress,shortFormattedAddress,formattedAddress,location,addressComponents,businessStatus',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const dataFinderRegx = (c: string) => {
            const regx = new RegExp(`<span class="${c}">([^<]+)<\/span>`);
            const match = data.adrFormatAddress.match(regx);
            return match ? match[1] : '';
        };

        const cntry = data.addressComponents.find((component: any) =>
            component.types.includes('country')
        );

        console.log(data);

        const id = data.id;
        const displayName = data.displayName;
        const address1 = dataFinderRegx('street-address');
        const address2 = '';
        const city = dataFinderRegx('locality');
        const region = dataFinderRegx('region');
        const postalCode = dataFinderRegx('postal-code');
        const country = dataFinderRegx('country-name');
        const lat = data.location.latitude;
        const lng = data.location.longitude;
        const countryCode = cntry ? cntry.shortText : '';
        const types = data.types;
        const businessStatus = data.businessStatus;

        const formattedAddress = data.formattedAddress;

        const formattedData: AddressType = {
            id,
            address1,
            address2,
            formattedAddress,
            city,
            region,
            postalCode,
            country,
            lat,
            lng,
            countryCode,
            displayName,
            types,
            businessStatus
        };
        return {
            data: {
                address: formattedData,
                adrAddress: data.adrFormatAddress
            },
            error: null
        };
    } catch (err) {
        // console.error('Error fetching place details:', err);
        return { error: err, data: null };
    }
};
