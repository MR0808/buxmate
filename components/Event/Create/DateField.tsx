'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DateField = () => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                        <Popover
                            open={isCalendarOpen}
                            onOpenChange={setIsCalendarOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={'outline'}
                                        className={cn(
                                            'w-full pl-3 text-left font-normal',
                                            !field.value &&
                                                'text-muted-foreground'
                                        )}
                                    >
                                        {field.value ? (
                                            format(field.value, 'PPP')
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(e) => {
                                        field.onChange(e);
                                        setIsCalendarOpen(false);
                                    }}
                                    disabled={(date) => date < new Date()}
                                    captionLayout="dropdown"
                                />
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
export default DateField;
