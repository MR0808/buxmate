'use client';

import type React from 'react';

import { Command as CommandPrimitive } from 'cmdk';
import { Loader2 } from 'lucide-react';
import { useCallback, useState, useEffect, useTransition } from 'react';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandList
} from '@/components/ui/command';
import { useDebounce } from '@/hooks/useDebounce';
import { FormMessages } from '@/components/Form/FormMessages';
import type { CommonProps } from '@/types/places';
import { cn } from '@/lib/utils';
import { autocompleteFetch } from '@/actions/places';

const AddressAutoCompleteInput = (props: CommonProps) => {
    const {
        setSelectedPlaceId,
        selectedPlaceId,
        showInlineError,
        searchInput,
        setSearchInput,
        placeholder
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [isFetchingPredictions, startFetchingPredictions] = useTransition();

    const handleFocus = useCallback(() => setIsOpen(true), []);
    const handleBlur = useCallback(() => {
        // Delay closing to allow onSelect to fire before blur
        // This is a common pattern for Comboboxes to ensure click events on items register
        setTimeout(() => setIsOpen(false), 100);
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
            (event.target as HTMLInputElement).blur();
        }
    };

    const debouncedSearchInput = useDebounce(searchInput, 500);

    useEffect(() => {
        if (!debouncedSearchInput) {
            setPredictions([]);
            return;
        }

        startFetchingPredictions(async () => {
            try {
                const result = await autocompleteFetch(debouncedSearchInput);
                setPredictions(result?.data || []);
            } catch (error) {
                console.error('Error fetching autocomplete data:', error);
                setPredictions([]);
            }
        });
    }, [debouncedSearchInput]);

    return (
        <Command
            shouldFilter={false}
            onKeyDown={handleKeyDown}
            className={cn('h-auto overflow-visible')}
        >
            <div className="flex w-full items-center justify-between rounded-xl border bg-background text-sm ring-offset-background ">
                <CommandPrimitive.Input
                    value={searchInput}
                    onValueChange={setSearchInput} // This is where user typing updates the local searchInput state
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    placeholder={placeholder || 'Enter address'}
                    className="block h-12 w-full rounded-xl border-neutral-200 bg-white px-6 py-3 text-sm font-normal"
                />
            </div>
            {searchInput !== '' &&
                !isOpen &&
                !selectedPlaceId &&
                showInlineError && (
                    <FormMessages
                        type="error"
                        className="pt-1 text-sm"
                        messages={['Select a valid address from the list']}
                    />
                )}

            {isOpen && searchInput !== '' && (
                <div className="relative h-auto animate-in fade-in-0 zoom-in-95">
                    <CommandList>
                        <div className="absolute top-1.5 z-50 w-full">
                            <CommandGroup className="relative z-50 h-auto min-w-[8rem] overflow-hidden rounded-md border bg-background shadow-md">
                                {isFetchingPredictions ? (
                                    <div className="flex h-28 items-center justify-center">
                                        <Loader2 className="size-6 animate-spin" />
                                    </div>
                                ) : (
                                    <>
                                        {predictions.map(
                                            (prediction: {
                                                placePrediction: {
                                                    placeId: string;
                                                    place: string;
                                                    text: { text: string };
                                                };
                                            }) => (
                                                <CommandPrimitive.Item
                                                    value={
                                                        prediction
                                                            .placePrediction
                                                            .text.text
                                                    }
                                                    onSelect={() => {
                                                        setSearchInput(
                                                            prediction
                                                                .placePrediction
                                                                .text.text
                                                        ); // Update input with selected text
                                                        setSelectedPlaceId(
                                                            prediction
                                                                .placePrediction
                                                                .place
                                                        ); // Trigger fetch in parent
                                                        setIsOpen(false); // Close the dropdown
                                                    }}
                                                    className="flex h-max cursor-pointer select-text flex-col items-start gap-0.5 rounded-md p-2 px-3 hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground"
                                                    key={
                                                        prediction
                                                            .placePrediction
                                                            .placeId
                                                    }
                                                    onMouseDown={(e) =>
                                                        e.preventDefault()
                                                    } // Prevent blurring input on item click
                                                >
                                                    {
                                                        prediction
                                                            .placePrediction
                                                            .text.text
                                                    }
                                                </CommandPrimitive.Item>
                                            )
                                        )}
                                    </>
                                )}

                                <CommandEmpty>
                                    {!isFetchingPredictions &&
                                        predictions.length === 0 && (
                                            <div className="flex items-center justify-center py-4">
                                                {searchInput === ''
                                                    ? 'Please enter an address'
                                                    : 'No address found'}
                                            </div>
                                        )}
                                </CommandEmpty>
                            </CommandGroup>
                        </div>
                    </CommandList>
                </div>
            )}
        </Command>
    );
};

export default AddressAutoCompleteInput;
