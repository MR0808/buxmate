'use client';

import { useFormContext } from 'react-hook-form';

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { hourOptions, minuteOptions, periodOptions } from '@/utils/datetime';

const EventTimeField = () => {
    const form = useFormContext();

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Start Time
                </label>
                <div className="mt-2 flex gap-2 w-2/3">
                    <FormField
                        control={form.control}
                        name="startHour"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Hour" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hourOptions.map((hour) => (
                                                <SelectItem
                                                    key={hour.value}
                                                    value={hour.value}
                                                >
                                                    {hour.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-center pt-2">
                        :
                    </div>
                    <FormField
                        control={form.control}
                        name="startMinute"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Min" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {minuteOptions.map((minute) => (
                                                <SelectItem
                                                    key={minute.value}
                                                    value={minute.value}
                                                >
                                                    {minute.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="startPeriod"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="AM/PM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {periodOptions.map((period) => (
                                                <SelectItem
                                                    key={period.value}
                                                    value={period.value}
                                                >
                                                    {period.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default EventTimeField;
