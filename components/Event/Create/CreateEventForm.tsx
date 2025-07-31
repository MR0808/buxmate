'use client';

import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { CreateEventSchema } from '@/schemas/event';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadField from '@/components/Event/Create/ImageUploadField';
import type { AddEventProps } from '@/types/events';
import EventDateField from '@/components/Event/Create/EventDateField';
import LocationField from '@/components/Event/Create/LocationField';
import CurrencyField from '@/components/Event/Create/CurrencyField';
import TimezoneField from '@/components/Event/Create/TimezoneField';
import Link from 'next/link';
import { createEvent } from '@/actions/event';
import { logEventCreated } from '@/actions/audit/audit-event';
import { combineDateTime } from '@/utils/datetime';
import EventTimeField from '@/components/Event/Create/EventTimeField';

const CreateEventForm = ({
    currencies,
    defaultCurrency,
    countryProp,
    countries,
    states,
    userSession
}: AddEventProps) => {
    const [url, setUrl] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof CreateEventSchema>>({
        resolver: zodResolver(CreateEventSchema),
        defaultValues: {
            title: '',
            description: '',
            eventDate: format(new Date(), 'yyyy-MM-dd'),
            startHour: '07',
            startMinute: '00',
            startPeriod: 'PM',
            image: '',
            state: '',
            country: countryProp?.id || '',
            timezone: 'Australia/Melbourne',
            currency: defaultCurrency?.id || ''
        }
    });

    const watchedValues = form.watch();

    // Create DateTime object from form values
    const getDateTime = () => {
        if (
            !watchedValues.eventDate ||
            !watchedValues.startHour ||
            !watchedValues.startMinute ||
            !watchedValues.startPeriod
        ) {
            return null;
        }

        const eventDate = new Date(watchedValues.eventDate);
        const startDateTime = combineDateTime(
            eventDate,
            watchedValues.startHour,
            watchedValues.startMinute,
            watchedValues.startPeriod
        );

        return {
            startDateTime,
            formattedTime: `${watchedValues.startHour}:${watchedValues.startMinute} ${watchedValues.startPeriod}`
        };
    };

    const onSubmit = (values: z.infer<typeof CreateEventSchema>) => {
        startTransition(async () => {
            const info = getDateTime();
            if (info) {
                const newValues = { ...values, date: info.startDateTime };
                const data = await createEvent(newValues);

                if (!data.success) {
                    toast.error(
                        'There was an error creating your event, please try again'
                    );
                }

                if (data.success && data.data) {
                    if (userSession)
                        await logEventCreated(userSession?.user.id, {
                            eventId: data.data.id,
                            eventName: data.data.title,
                            eventDate: data.data.date
                        });
                    toast.success('Event successfully created');
                    router.push(`/event/${data.data.slug}`);
                }
            } else {
                toast.error(
                    'There was an error creating your event, please try again'
                );
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        <h1 className="text-2xl font-semibold mb-2">
                            Create Your Event
                        </h1>
                    </CardTitle>
                    <CardDescription>
                        Complete all the fields below to start your event
                        creation
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="mb-10">
                                <h2 className="text-xl font-semibold mb-2">
                                    Event Information
                                </h2>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <EventDateField />
                                    <EventTimeField />
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Event Image
                                                </FormLabel>
                                                <FormControl>
                                                    <ImageUploadField
                                                        bucket="eventimages"
                                                        name="image"
                                                        setUrl={setUrl}
                                                        url={url}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">
                                    Event Logistics
                                </h2>
                                <div className="space-y-4">
                                    <LocationField
                                        countries={countries}
                                        states={states}
                                    />
                                    <TimezoneField />
                                    <CurrencyField currencies={currencies} />
                                </div>
                            </div>

                            <div className="flex justify-between pt-6">
                                <Link href="/">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>

                                <Button type="submit" disabled={isPending}>
                                    {isPending ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
export default CreateEventForm;
