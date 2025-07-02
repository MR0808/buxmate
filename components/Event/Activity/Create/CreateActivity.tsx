'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitErrorHandler } from 'react-hook-form';
import React, { useState, useTransition, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
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
import { CreateActivityProps } from '@/types/events';
import { CreateActivitySchema } from '@/schemas/event';
import Autocomplete from '@/components/Autocomplete/Autocomplete';
import { Input } from '@/components/ui/input';
import { TimePicker } from '@/components/ui/time-picker';
import { Textarea } from '@/components/ui/textarea';
import { createActivity } from '@/actions/activity';
import { toast } from 'sonner';
import { logActivityCreated } from '@/actions/audit/audit-event';

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

const MemoizedAutocomplete = React.memo(Autocomplete);

const CreateActivity = ({
    open,
    setOpen,
    eventId,
    userSession
}: CreateActivityProps) => {
    const [isPending, startTransition] = useTransition();
    const displayValueRef = useRef('');
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
            startTime: '',
            endTime: '',
            notes: ''
        }
    });

    const onSubmit = useCallback(
        (values: z.infer<typeof CreateActivitySchema>) => {
            startTransition(async () => {
                console.log(values);
                const data = await createActivity(values, eventId);

                if (!data.success) {
                    toast.error(
                        'There was an error creating your activity, please try again'
                    );
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

                    // Reset form after successful submission
                    form.reset();
                    displayValueRef.current = '';

                    router.refresh();
                    setOpen(false);
                }
            });
        },
        [eventId, userSession, form, router, setOpen]
    );

    const onError: SubmitErrorHandler<z.infer<typeof CreateActivitySchema>> =
        useCallback((errors) => {
            console.log(errors);
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle>Create Project</DialogTitle>
                </DialogHeader>
                <DialogDescription className="hidden"></DialogDescription>
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
                                    <FormLabel className="mb-6">
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
                                    <FormLabel className="mb-6">
                                        Activity Location
                                    </FormLabel>
                                    <FormControl>
                                        <MemoizedAutocomplete />
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
                                    <FormLabel className="mb-6">Cost</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="$0.00"
                                            onChange={(e) => {
                                                const formatted =
                                                    formatInputValue(
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
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="mb-6">
                                        Start Time
                                    </FormLabel>
                                    <FormControl>
                                        <TimePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select start time"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="mb-6">
                                        End Time
                                    </FormLabel>
                                    <FormControl>
                                        <TimePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select end time"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
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
            </DialogContent>
        </Dialog>
    );
};

export default CreateActivity;
