'use client';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitErrorHandler } from 'react-hook-form';
import { useTransition, useState } from 'react';
import { toast } from 'sonner';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/Form/Buttons';
import { AddGuestsProps, ValidationResult } from '@/types/events';
import { AddGuestsSchema } from '@/schemas/event';
import { addGuests } from '@/actions/event';

const AddGuests = ({ open, setOpen }: AddGuestsProps) => {
    const [isPending, startTransition] = useTransition();
    const [lastResult, setLastResult] = useState<ValidationResult | null>(null);

    const form = useForm<z.infer<typeof AddGuestsSchema>>({
        resolver: zodResolver(AddGuestsSchema),
        defaultValues: {
            emails: '',
            phoneNumbers: ''
        }
    });
    function onSubmit(values: z.infer<typeof AddGuestsSchema>) {
        startTransition(async () => {
            const result = await addGuests(values);

            if (result.success && result.data) {
                toast.success(result.message);
                setLastResult(result.data.validatedData);
                form.reset();
            } else {
                toast.error(result.message);
                setLastResult(null);

                // Handle validation errors
                if (!result.errors) {
                    result.errors.forEach((error) => {
                        if (error.path.includes('emails')) {
                            form.setError('emails', { message: error.message });
                        } else if (error.path.includes('phoneNumbers')) {
                            form.setError('phoneNumbers', {
                                message: error.message
                            });
                        } else if (error.path.includes('root')) {
                            form.setError('root', { message: error.message });
                        }
                    });
                }
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Guests</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add guests below either by email or phone number. All guests
                    will receive an invite to the site if they aren&apos;t
                    already a member, as well as added to your event.
                </DialogDescription>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="emails"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Addresses</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter email addresses (e.g., john@example.com, jane@example.com or paste a list)"
                                            className="min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Separate multiple emails with commas,
                                        spaces, or new lines
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phoneNumbers"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Numbers</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter phone numbers (e.g., +1-555-123-4567, (555) 987-6543 or paste a list)"
                                            className="min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Separate multiple phone numbers with
                                        commas, spaces, or new lines
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <SubmitButton
                            text="Validate & Add Guests"
                            className="w-full"
                            isPending={isPending}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddGuests;
