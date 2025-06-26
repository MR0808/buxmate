'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandItem
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { CurrencyProps } from '@/types/events';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CurrencyField = ({ currencies }: CurrencyProps) => {
    const [openCurrency, setOpenCurrency] = useState(false);

    const form = useFormContext();

    const currencyDisplayName = useMemo(() => {
        return (id: string) => {
            // Handle edge cases - if it's not a string or is a date, return default
            if (
                !id ||
                typeof id !== 'string' ||
                id.includes('GMT') ||
                id.includes('Standard Time')
            ) {
                return 'Select Currency...';
            }

            const currencySelect = currencies.find(
                (currency) => currency.id === id
            );
            if (currencySelect) {
                return `${currencySelect.code} - ${currencySelect.name} (${currencySelect.symbolNative})`;
            } else {
                return 'Select Currency...';
            }
        };
    }, [currencies]);

    return (
        <FormField
            control={form.control}
            name="currency"
            render={({ field }) => {
                // Get the actual currency value directly from form
                const actualCurrencyValue = form.getValues('currency');

                // Use the actual form value instead of field.value to avoid the bug
                const displayValue = actualCurrencyValue || field.value;

                return (
                    <FormItem className={cn('w-full')}>
                        <FormLabel>Currency</FormLabel>
                        <Popover
                            open={openCurrency}
                            onOpenChange={setOpenCurrency}
                        >
                            <PopoverTrigger asChild className="w-full">
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCurrency}
                                        className="h-12 w-full justify-between rounded-xl px-6 py-3 text-sm font-normal"
                                    >
                                        {displayValue &&
                                        typeof displayValue === 'string'
                                            ? currencyDisplayName(displayValue)
                                            : 'Select Currency...'}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command
                                    className="w-full"
                                    filter={(value, search) => {
                                        const item = currencies.find(
                                            (item) =>
                                                item.id.toString() === value
                                        );
                                        if (!item) return 0;
                                        if (
                                            item.name
                                                .toLowerCase()
                                                .includes(
                                                    search.toLowerCase()
                                                ) ||
                                            item.code
                                                .toLowerCase()
                                                .includes(search.toLowerCase())
                                        )
                                            return 1;
                                        return 0;
                                    }}
                                >
                                    <CommandInput
                                        placeholder="Search Currency..."
                                        className="h-9 w-full"
                                    />
                                    <CommandList className="w-full">
                                        <CommandEmpty className="w-full">
                                            No currency found.
                                        </CommandEmpty>
                                        <CommandGroup className="w-full">
                                            {currencies.map((currency) => (
                                                <CommandItem
                                                    className="w-full"
                                                    key={currency.id}
                                                    value={currency.id.toString()}
                                                    onSelect={() => {
                                                        form.setValue(
                                                            'currency',
                                                            currency.id
                                                        );
                                                        setOpenCurrency(false);
                                                    }}
                                                >
                                                    {`${currency.code} - ${currency.name} (${currency.symbolNative})`}
                                                    <CheckIcon
                                                        className={cn(
                                                            'ml-auto h-4 w-4',
                                                            currency.id ===
                                                                displayValue
                                                                ? 'opacity-100'
                                                                : 'opacity-0'
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
};
export default CurrencyField;
