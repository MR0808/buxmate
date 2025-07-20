'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitErrorHandler } from 'react-hook-form';
import { useTransition, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Clock, Calendar } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { SubmitButton } from '@/components/Form/Buttons';
import { AccountFormInput } from '@/components/Form/FormInput';
import { cn } from '@/lib/utils';
import { CreateActivityProps } from '@/types/activity';
import { CreateActivitySchema } from '@/schemas/activity';
import Autocomplete from '@/components/Autocomplete/Autocomplete';
import AddressAutoComplete from '@/components/Autocomplete/AddressAutoComplete';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createActivity } from '@/actions/activity';
import { toast } from 'sonner';
import { logActivityCreated } from '@/actions/audit/audit-event';
import {
    combineDateTime,
    formatTime12Hour,
    hourOptions,
    minuteOptions,
    periodOptions
} from '@/utils/datetime';
import ActivityDateField from '@/components/Event/Activity/Create/ActivityDateField';

const formatInputValue = (value: string): string => {
    let cleaned = value.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1] && parts[1].length > 2) {
        cleaned = parts[0] + '.' + parts[1].substring(0, 2);
    }
    return cleaned ? `$${cleaned}` : '';
};

const CreateActivity = ({ event, userSession }: CreateActivityProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof CreateActivitySchema>>({
        resolver: zodResolver(CreateActivitySchema),
        defaultValues: {
            activityName: '',
            placeId: '',
            formattedAddress: '',
            latitude: 0,
            longitude: 0,
            cost: '',
            activityDate: toZonedTime(event.date, event.timezone),
            startHour: '09',
            startMinute: '00',
            startPeriod: 'AM',
            endHour: '05',
            endMinute: '00',
            endPeriod: 'PM',
            notes: ''
        }
    });

    const watchedValues = form.watch();

    // Calculate duration and create DateTime objects
    const getDateTimeInfo = useMemo(() => {
        const {
            activityDate,
            startHour,
            startMinute,
            startPeriod,
            endHour,
            endMinute,
            endPeriod
        } = watchedValues;

        if (
            !activityDate ||
            !startHour ||
            !startMinute ||
            !startPeriod ||
            !endHour ||
            !endMinute ||
            !endPeriod
        ) {
            return null;
        }

        try {
            const eventDate = new Date(activityDate);
            const startDateTime = combineDateTime(
                eventDate,
                startHour,
                startMinute,
                startPeriod
            );
            const endDateTime = combineDateTime(
                eventDate,
                endHour,
                endMinute,
                endPeriod
            );

            let spansNextDay = false;

            // If end time is earlier than start time, assume it's next day
            if (endDateTime <= startDateTime) {
                endDateTime.setDate(endDateTime.getDate() + 1);
                spansNextDay = true;
            }

            const durationMs = endDateTime.getTime() - startDateTime.getTime();
            const durationMinutes = Math.floor(durationMs / (1000 * 60));
            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;

            const startTime12 = formatTime12Hour(
                startHour,
                startMinute,
                startPeriod
            );
            const endTime12 = formatTime12Hour(endHour, endMinute, endPeriod);

            return {
                startDateTime,
                endDateTime,
                startTime12,
                endTime12,
                hours,
                minutes,
                spansNextDay,
                totalMinutes: durationMinutes
            };
        } catch (error) {
            console.error('Error calculating date time info:', error);
            return null;
        }
    }, [
        watchedValues.activityDate,
        watchedValues.startHour,
        watchedValues.startMinute,
        watchedValues.startPeriod,
        watchedValues.endHour,
        watchedValues.endMinute,
        watchedValues.endPeriod
    ]);

    const dateTimeInfo = getDateTimeInfo;

    const onSubmit = useCallback(
        (values: z.infer<typeof CreateActivitySchema>) => {
            if (isPending) return;
            startTransition(async () => {
                try {
                    // Recalculate date time info at submission time
                    const eventDate = new Date(values.activityDate);
                    const startDateTime = combineDateTime(
                        eventDate,
                        values.startHour,
                        values.startMinute,
                        values.startPeriod
                    );
                    const endDateTime = combineDateTime(
                        eventDate,
                        values.endHour,
                        values.endMinute,
                        values.endPeriod
                    );

                    // If end time is earlier than start time, assume it's next day
                    if (endDateTime <= startDateTime) {
                        endDateTime.setDate(endDateTime.getDate() + 1);
                    }

                    const newValues = {
                        ...values,
                        startTime: startDateTime,
                        endTime: endDateTime
                    };

                    const data = await createActivity(newValues, event.id);

                    if (!data.success) {
                        toast.error(data.message);
                        return;
                    }

                    if (data.success && data.data) {
                        if (userSession) {
                            await logActivityCreated(userSession?.user.id, {
                                activityId: data.data.id,
                                activityName: data.data.name,
                                eventId: data.data.eventId
                            });
                        }
                        toast.success('Activity successfully created');

                        router.replace(`/event/${event.slug}`);
                    }
                } catch (error) {
                    console.error('Error creating activity:', error);
                    toast.error(
                        'There was an error creating your activity, please try again'
                    );
                }
            });
        },
        [event.id, userSession, router, isPending]
    );

    const onError: SubmitErrorHandler<z.infer<typeof CreateActivitySchema>> =
        useCallback((errors) => {
            console.log('Form validation errors:', errors);

            // Show specific error messages
            if (errors.formattedAddress) {
                toast.error('Please select a valid address from the dropdown');
            }
            if (errors.activityName) {
                toast.error('Activity name is required');
            }
        }, []);

    // const handleInputCostChange = useCallback(
    //     (value: string, onChange: (value: string) => void) => {
    //         const formatted = formatInputValue(value);
    //         setDisplayValue(formatted);
    //         onChange(formatted);
    //     },
    //     []
    // );

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="activityName"
                    render={({ field }) => (
                        <FormItem className={cn('w-full')}>
                            <FormLabel className="mb-2">
                                Activity Name
                            </FormLabel>
                            <FormControl>
                                <AccountFormInput
                                    {...field}
                                    placeholder="Activity name"
                                    name="activityName"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="formattedAddress"
                    render={({ field }) => (
                        <FormItem className={cn('w-full')}>
                            <FormLabel className="mb-2">
                                Activity Location
                            </FormLabel>
                            <FormControl>
                                {/* Directly use AddressAutoComplete and pass field props */}
                                <AddressAutoComplete {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                        <FormItem className={cn('w-full')}>
                            <FormLabel className="mb-2">Cost</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="$0.00"
                                    onChange={(e) => {
                                        const formatted = formatInputValue(
                                            e.target.value
                                        );
                                        field.onChange(formatted);
                                    }}
                                    className={cn(
                                        'h-12 rounded-xl px-6 py-3 text-sm font-normal'
                                    )}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ActivityDateField />
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Start Time
                        </label>
                        <div className="flex gap-2 mt-2 w-2/3">
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
                                                    {minuteOptions.map(
                                                        (minute) => (
                                                            <SelectItem
                                                                key={
                                                                    minute.value
                                                                }
                                                                value={
                                                                    minute.value
                                                                }
                                                            >
                                                                {minute.label}
                                                            </SelectItem>
                                                        )
                                                    )}
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
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="AM/PM" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {periodOptions.map(
                                                        (period) => (
                                                            <SelectItem
                                                                key={
                                                                    period.value
                                                                }
                                                                value={
                                                                    period.value
                                                                }
                                                            >
                                                                {period.label}
                                                            </SelectItem>
                                                        )
                                                    )}
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
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            End Time
                        </label>
                        <div className="flex gap-2 mt-6 w-2/3">
                            <FormField
                                control={form.control}
                                name="endHour"
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
                                name="endMinute"
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
                                                    {minuteOptions.map(
                                                        (minute) => (
                                                            <SelectItem
                                                                key={
                                                                    minute.value
                                                                }
                                                                value={
                                                                    minute.value
                                                                }
                                                            >
                                                                {minute.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endPeriod"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="AM/PM" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {periodOptions.map(
                                                        (period) => (
                                                            <SelectItem
                                                                key={
                                                                    period.value
                                                                }
                                                                value={
                                                                    period.value
                                                                }
                                                            >
                                                                {period.label}
                                                            </SelectItem>
                                                        )
                                                    )}
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
                {dateTimeInfo && dateTimeInfo.totalMinutes > 0 && (
                    <div className="rounded-lg border bg-muted/50 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Clock className="h-4 w-4" />
                            Event Preview
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <div>
                                <strong>Start:</strong>{' '}
                                {format(
                                    dateTimeInfo.startDateTime,
                                    "PPP 'at' p"
                                )}
                            </div>
                            <div>
                                <strong>End:</strong>{' '}
                                {format(dateTimeInfo.endDateTime, "PPP 'at' p")}
                            </div>
                            <div>
                                <strong>Duration:</strong> {dateTimeInfo.hours}h{' '}
                                {dateTimeInfo.minutes}m
                            </div>
                            {dateTimeInfo.spansNextDay && (
                                <div className="flex items-center gap-1 text-amber-600">
                                    <Calendar className="h-3 w-3" />
                                    <span className="text-xs font-medium">
                                        Event continues to next day
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="mb-2">Notes</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <SubmitButton
                    text="Create"
                    className="w-full"
                    isPending={isPending}
                />
            </form>
        </Form>
    );
};

export default CreateActivity;
