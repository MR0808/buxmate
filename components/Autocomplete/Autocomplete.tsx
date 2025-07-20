'use client';

import { useState, useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import type { AddressType } from '@/types/places';
import AddressAutoComplete from './AddressAutoComplete';

const Autocomplete = ({ addressData }: { addressData?: AddressType }) => {
    const form = useFormContext();
    const hasInitialized = useRef(false);

    const [address, setAddress] = useState<AddressType>(() => {
        // Initialize with existing form data if available
        const formattedAddress = form?.getValues('formattedAddress');
        const displayName = form?.getValues('displayName');

        if (formattedAddress && !hasInitialized.current) {
            hasInitialized.current = true;
            return {
                id: form.getValues('placeId') || '',
                displayName: { text: displayName || '' },
                address1: form.getValues('address1') || '',
                address2: form.getValues('address2') || '',
                formattedAddress: formattedAddress,
                city: form.getValues('city') || '',
                region: form.getValues('region') || '',
                postalCode: form.getValues('postalCode') || '',
                country: form.getValues('country') || '',
                lat: form.getValues('latitude') || 0,
                lng: form.getValues('longitude') || 0,
                countryCode: form.getValues('countryCode') || '',
                types: form.getValues('types') || [],
                businessStatus: form.getValues('businessStatus') || ''
            };
        }

        return (
            addressData || {
                id: '',
                displayName: { text: '' },
                address1: '',
                address2: '',
                formattedAddress: '',
                city: '',
                region: '',
                postalCode: '',
                country: '',
                lat: 0,
                lng: 0,
                countryCode: '',
                types: [],
                businessStatus: ''
            }
        );
    });

    const [searchInput, setSearchInput] = useState('');
    const [resultInput, setResultInput] = useState(() => {
        const formattedAddress = form?.getValues('formattedAddress');
        const displayName = form?.getValues('displayName');
        return displayName || formattedAddress || '';
    });

    // Stable setters to prevent child re-renders
    const stableSetAddress = useCallback((newAddress: AddressType) => {
        setAddress(newAddress);
    }, []);

    const stableSetSearchInput = useCallback((input: string) => {
        setSearchInput(input);
    }, []);

    const stableSetResultInput = useCallback((input: string) => {
        setResultInput(input);
    }, []);

    return (
        // <AddressAutoComplete
        //     // address={address}
        //     setAddress={stableSetAddress}
        //     searchInput={searchInput}
        //     setSearchInput={stableSetSearchInput}
        //     resultInput={resultInput}
        //     setResultInput={stableSetResultInput}
        // />
        <></>
    );
};

export default Autocomplete;
