'use client';

import type * as z from 'zod';
import { Delete } from 'lucide-react';
import { useEffect, useState, useTransition, useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AddressAutoCompleteProps, AddressType } from '@/types/places';
import AddressAutoCompleteInput from './AddressAutoCompleteInput';
import type { CreateActivitySchema } from '@/schemas/event';
import { cn } from '@/lib/utils';
import { placesFetch } from '@/actions/places';
import { isLikelyBusiness } from '@/utils/geolocation';

const AddressAutoComplete = (props: AddressAutoCompleteProps) => {
    const {
        address,
        setAddress,
        showInlineError = true,
        searchInput,
        setSearchInput,
        placeholder,
        resultInput,
        setResultInput
    } = props;

    const form = useFormContext<z.infer<typeof CreateActivitySchema>>();
    const [isPending, startTransition] = useTransition();
    const [selectedPlaceId, setSelectedPlaceId] = useState('');
    const isResetting = useRef(false);

    // Memoize the reset function to prevent unnecessary re-renders
    const resetAddress = useCallback(() => {
        if (isResetting.current) return;

        isResetting.current = true;

        setSelectedPlaceId('');
        setSearchInput('');
        setResultInput('');
        setAddress({
            id: '',
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
            businessStatus: '',
            displayName: { text: '' }
        });

        // Clear form values
        form.setValue('placeId', '');
        form.setValue('displayName', '');
        form.setValue('address1', '');
        form.setValue('address2', '');
        form.setValue('city', '');
        form.setValue('region', '');
        form.setValue('postalCode', '');
        form.setValue('country', '');
        form.setValue('formattedAddress', '');
        form.setValue('countryCode', '');
        form.setValue('latitude', 0);
        form.setValue('longitude', 0);
        form.setValue('types', []);
        form.setValue('busisnessStatus', '');

        setTimeout(() => {
            isResetting.current = false;
        }, 100);
    }, [setSelectedPlaceId, setSearchInput, setResultInput, setAddress, form]);

    useEffect(() => {
        if (selectedPlaceId === '' || isResetting.current) return;

        startTransition(async () => {
            try {
                const result = await placesFetch(selectedPlaceId);

                if (result?.data?.address) {
                    const adrInputs = result.data.address as AddressType;
                    setAddress(adrInputs);

                    const isBusiness = await isLikelyBusiness({
                        types: adrInputs.types || [],
                        businessStatus: adrInputs.businessStatus || ''
                    });

                    const displayText = isBusiness
                        ? adrInputs.displayName?.text
                        : adrInputs.formattedAddress;

                    setResultInput(displayText || '');

                    // Update form values
                    form.setValue('placeId', adrInputs.id);
                    form.setValue(
                        'displayName',
                        adrInputs.displayName?.text || ''
                    );
                    form.setValue('address1', adrInputs.address1);
                    form.setValue('address2', adrInputs.address2);
                    form.setValue('city', adrInputs.city);
                    form.setValue('region', adrInputs.region);
                    form.setValue('postalCode', adrInputs.postalCode);
                    form.setValue('country', adrInputs.country);
                    form.setValue(
                        'formattedAddress',
                        adrInputs.formattedAddress
                    );
                    form.setValue('countryCode', adrInputs.countryCode);
                    form.setValue('latitude', adrInputs.lat);
                    form.setValue('longitude', adrInputs.lng);
                    form.setValue('types', adrInputs.types || []);
                    form.setValue(
                        'busisnessStatus',
                        adrInputs.businessStatus || ''
                    );
                }
            } catch (error) {
                console.error('Error fetching place data:', error);
            }
        });
    }, [selectedPlaceId, setAddress, setResultInput, form]);

    const hasSelectedAddress =
        selectedPlaceId !== '' || address.formattedAddress;

    return (
        <>
            {isPending ? (
                <div className="flex items-center gap-2">
                    <Input
                        value="Loading..."
                        readOnly
                        className={cn(
                            'block h-12 w-full rounded-xl border-neutral-200 bg-white px-5'
                        )}
                    />
                </div>
            ) : hasSelectedAddress ? (
                <div className="flex items-center gap-2">
                    <Input
                        value={resultInput}
                        readOnly
                        className={cn(
                            'block h-12 w-full rounded-xl border-neutral-200 bg-white px-5'
                        )}
                    />
                    <Button
                        type="button"
                        onClick={resetAddress}
                        variant="outline"
                        className="h-12 w-12 shrink-0 rounded-xl bg-transparent"
                    >
                        <Delete className="size-6" />
                    </Button>
                </div>
            ) : (
                <AddressAutoCompleteInput
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    selectedPlaceId={selectedPlaceId}
                    setSelectedPlaceId={setSelectedPlaceId}
                    showInlineError={showInlineError}
                    placeholder={placeholder}
                />
            )}
        </>
    );
};

export default AddressAutoComplete;
