'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';

interface MultiSelectProps {
    options: { label: string; value: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
    maxDisplay?: number;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = 'Select items...',
    className,
    maxDisplay = 3
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i !== item));
    };

    const handleSelect = (item: string) => {
        if (selected.includes(item)) {
            onChange(selected.filter((i) => i !== item));
        } else {
            onChange([...selected, item]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'justify-between text-left font-normal min-h-10',
                        className
                    )}
                >
                    <div className="flex items-center flex-1 min-h-8">
                        {selected.length === 0 ? (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        ) : (
                            <div className="flex flex-wrap gap-1 max-w-full">
                                {selected.slice(0, maxDisplay).map((item) => {
                                    const option = options.find(
                                        (opt) => opt.value === item
                                    );
                                    return (
                                        <Badge
                                            variant="secondary"
                                            key={item}
                                            className="text-xs shrink-0 cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleUnselect(item);
                                            }}
                                        >
                                            {option?.label}
                                            <span
                                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleUnselect(item);
                                                    }
                                                }}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleUnselect(item);
                                                }}
                                                tabIndex={0}
                                                role="button"
                                                aria-label={`Remove ${option?.label}`}
                                            >
                                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                            </span>
                                        </Badge>
                                    );
                                })}
                                {selected.length > maxDisplay && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs shrink-0"
                                    >
                                        +{selected.length - maxDisplay} more
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            selected.includes(option.value)
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
