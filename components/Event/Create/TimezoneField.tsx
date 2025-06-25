'use client';

import { useEffect, useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { getGroupedTimezones, GroupedTimezones } from '@/utils/timezones';
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem
} from '@/components/ui/command';
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

const TimezoneField = () => {
    const name = 'timezone';
    const { control, setValue, watch } = useFormContext();
    const selected = watch(name);
    const [open, setOpen] = useState(false);
    const [groups, setGroups] = useState<GroupedTimezones[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>('Loading...');
    const selectedItemRef = useRef<HTMLDivElement | null>(null);

    // Populate timezone groups once
    useEffect(() => {
        const gtz = getGroupedTimezones();
        setGroups(gtz);
    }, []);

    // Update the label when selection changes
    useEffect(() => {
        const found = groups
            .flatMap((g) => g.zones)
            .find((z) => z.value === selected);
        setSelectedLabel(found?.label ?? 'Select timezone');
    }, [selected, groups]);

    // Ensure scrollToSelected triggers AFTER content is rendered
    useEffect(() => {
        if (open && selectedItemRef.current) {
            const timeout = setTimeout(() => {
                selectedItemRef.current?.scrollIntoView({
                    behavior: 'auto',
                    block: 'nearest'
                });
            }, 50); // delay ensures DOM is painted
            return () => clearTimeout(timeout);
        }
    }, [open, selected]);

    return (
        <FormField
            control={control}
            name={name}
            render={() => (
                <FormItem className={cn('w-full')}>
                    <FormLabel>Timezone</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="h-12 w-full justify-between rounded-xl px-6 py-3 text-sm font-normal"
                                >
                                    {selectedLabel}
                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>

                        <PopoverContent className="w-full p-0 max-h-[400px] overflow-y-auto">
                            <Command className="w-full">
                                <CommandInput
                                    placeholder="Search timezone..."
                                    className="h-9 w-full"
                                />
                                {groups.map((group) => (
                                    <CommandGroup
                                        key={group.region}
                                        heading={group.region}
                                        className="w-full"
                                    >
                                        {group.zones.map((tz) => {
                                            const isSelected =
                                                tz.value === selected;
                                            return (
                                                <CommandItem
                                                    key={tz.value}
                                                    onSelect={() => {
                                                        setValue(
                                                            name,
                                                            tz.value
                                                        );
                                                        setSelectedLabel(
                                                            tz.label
                                                        );
                                                        setOpen(false);
                                                    }}
                                                    ref={
                                                        isSelected
                                                            ? selectedItemRef
                                                            : null
                                                    }
                                                    className="w-full"
                                                >
                                                    <span>{tz.label}</span>
                                                    {isSelected && (
                                                        <CheckIcon
                                                            className={cn(
                                                                'ml-auto h-4 w-4'
                                                            )}
                                                        />
                                                    )}
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandGroup>
                                ))}
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default TimezoneField;
