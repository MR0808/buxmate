'use client';

import type * as z from 'zod';
import { Delete } from 'lucide-react';
import { useEffect, useState, useTransition, useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AddressType } from '@/types/places';
import AddressAutoCompleteInput from './AddressAutoCompleteInput';
import type { CreateActivitySchema } from '@/schemas/activity'; // Assuming this is the correct schema
import { cn } from '@/lib/utils';
import { placesFetch } from '@/actions/places';
import { isLikelyBusiness } from '@/utils/geolocation';

interface AddressAutoCompleteProps {
    value: string; // formattedAddress from form
    onChange: (...event: any[]) => void; // onChange from form
    name: string; // name from form
}

const AddressAutoComplete = ({
    value,
    onChange,
    name
}: AddressAutoCompleteProps) => {
    const form = useFormContext<z.infer<typeof CreateActivitySchema>>();
    const [isFetchingPlaceDetails, startFetchingPlaceDetails] = useTransition();
    const [internalSelectedPlaceId, setInternalSelectedPlaceId] = useState(''); // Internal state for the place ID trigger
    const [searchInput, setSearchInput] = useState(value || ''); // State for the text input by user
    const isResettingRef = useRef(false); // Ref to manage reset state across renders

    // --- REMOVED THE PROBLEMTAIC useEffect HERE ---
    // This useEffect was causing the input to reset during typing.
    // The searchInput will now be controlled by AddressAutoCompleteInput during typing,
    // and only updated by this component on explicit selection or reset.

    // Callback to be passed to AddressAutoCompleteInput to update the internal selected place ID
    const handlePlaceIdSelected = useCallback((placeId: string) => {
        console.log('handlePlaceIdSelected called with:', placeId);
        setInternalSelectedPlaceId(placeId);
    }, []);

    const resetAddress = useCallback(() => {
        console.log('resetAddress initiated.');
        isResettingRef.current = true;

        setInternalSelectedPlaceId(''); // Clear the internal selected place ID
        setSearchInput(''); // Clear the text in the input field
        onChange(''); // Clear the formattedAddress in the form

        // Clear all related form values
        form.setValue('placeId', '');
        form.setValue('displayName', '');
        form.setValue('address1', '');
        form.setValue('address2', '');
        form.setValue('city', '');
        form.setValue('region', '');
        form.setValue('postalCode', '');
        form.setValue('country', '');
        form.setValue('countryCode', '');
        form.setValue('latitude', 0);
        form.setValue('longitude', 0);
        form.setValue('types', []);
        form.setValue('businessStatus', '');

        form.clearErrors('formattedAddress');

        setTimeout(() => {
            isResettingRef.current = false;
            form.trigger('formattedAddress');
            console.log('resetAddress completed.');
        }, 100);
    }, [onChange, form]);

    useEffect(() => {
        console.log(
            'AddressAutoComplete useEffect triggered. internalSelectedPlaceId:',
            internalSelectedPlaceId,
            'isResettingRef.current:',
            isResettingRef.current
        );

        // Only proceed if a placeId is selected and we are not currently resetting
        if (internalSelectedPlaceId === '' || isResettingRef.current) {
            console.log(
                'Skipping fetch: internalSelectedPlaceId is empty or resetting.'
            );
            return;
        }

        // Clear the internalSelectedPlaceId immediately to prevent re-triggering this effect
        // if the component re-renders for other reasons while the fetch is ongoing.
        // The fetch operation is now solely triggered by the *change* in internalSelectedPlaceId.
        const placeIdToFetch = internalSelectedPlaceId;
        setInternalSelectedPlaceId(''); // Clear the trigger immediately

        startFetchingPlaceDetails(async () => {
            console.log(
                'startFetchingPlaceDetails initiated for placeId:',
                placeIdToFetch
            );
            try {
                const result = await placesFetch(placeIdToFetch);
                console.log(
                    'placesFetch result for',
                    placeIdToFetch,
                    ':',
                    result
                );

                if (result?.data?.address) {
                    const adrInputs = result.data.address as AddressType;

                    const isBusiness = await isLikelyBusiness({
                        types: adrInputs.types || [],
                        businessStatus: adrInputs.businessStatus || ''
                    });

                    const displayText = isBusiness
                        ? adrInputs.displayName?.text
                        : adrInputs.formattedAddress;

                    onChange(displayText || ''); // Update the form's formattedAddress field. This is the source of truth.
                    setSearchInput(displayText || ''); // Keep searchInput in sync with the selected display text

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
                    form.setValue('countryCode', adrInputs.countryCode);
                    form.setValue('latitude', adrInputs.lat);
                    form.setValue('longitude', adrInputs.lng);
                    form.setValue('types', adrInputs.types || []);
                    form.setValue(
                        'businessStatus',
                        adrInputs.businessStatus || ''
                    );

                    form.clearErrors('formattedAddress');
                    form.trigger('formattedAddress');
                    console.log(
                        'Address data processed successfully for',
                        placeIdToFetch
                    );
                } else {
                    console.warn(
                        'No address data found for selected place ID:',
                        placeIdToFetch
                    );
                    resetAddress();
                    toast.error(
                        'Could not retrieve address details. Please try another location.'
                    );
                }
            } catch (error) {
                console.error(
                    'Error fetching place data in startFetchingPlaceDetails for',
                    placeIdToFetch,
                    ':',
                    error
                );
                resetAddress();
                toast.error(
                    'An error occurred while fetching address details. Please try again.'
                );
            } finally {
                console.log(
                    'startFetchingPlaceDetails finished for placeId:',
                    placeIdToFetch
                );
            }
        });
    }, [internalSelectedPlaceId, onChange, form, resetAddress]); // Depend on internalSelectedPlaceId

    // Determine if an address is currently selected/displayed based on the form's value
    // This ensures the read-only input is shown only when the form's value is populated.
    const hasSelectedAddress = !!value && value !== 'Loading...';

    return (
        <>
            {isFetchingPlaceDetails ? (
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
                        value={value} // Display the actual form value (formattedAddress)
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
                    selectedPlaceId={internalSelectedPlaceId} // Pass internalSelectedPlaceId to input for its own logic
                    setSelectedPlaceId={handlePlaceIdSelected} // Use the new handler to update internal state
                    showInlineError={true}
                    placeholder="Enter activity location"
                />
            )}
        </>
    );
};

export default AddressAutoComplete;
