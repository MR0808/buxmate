'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { AddressType } from '@/types/places';
import AddressAutoComplete from './AddressAutoComplete';

const Autocomplete = ({ addressData }: { addressData?: AddressType }) => {
    const form = useFormContext();
    const isInitialized = useRef(false);

    const [address, setAddress] = useState<AddressType>(
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

    const [searchInput, setSearchInput] = useState('');
    const [resultInput, setResultInput] = useState('');

    // Initialize from form values if they exist
    useEffect(() => {
        if (!isInitialized.current && form) {
            const formattedAddress = form.getValues('formattedAddress');
            const displayName = form.getValues('displayName');

            if (formattedAddress || displayName) {
                setResultInput(displayName || formattedAddress);
                isInitialized.current = true;
            }
        }
    }, [form]);

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
        <AddressAutoComplete
            address={address}
            setAddress={stableSetAddress}
            searchInput={searchInput}
            setSearchInput={stableSetSearchInput}
            resultInput={resultInput}
            setResultInput={stableSetResultInput}
        />
    );
};

// Add comparison function to prevent re-renders when props haven't changed
const AutocompleteWithMemo = React.memo(
    Autocomplete,
    (prevProps, nextProps) => {
        // Only re-render if addressData actually changes
        return (
            JSON.stringify(prevProps.addressData) ===
            JSON.stringify(nextProps.addressData)
        );
    }
);

AutocompleteWithMemo.displayName = 'Autocomplete';

export default AutocompleteWithMemo;
