'use client';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitErrorHandler } from 'react-hook-form';
import { useTransition, useState } from 'react';
import { toast } from 'sonner';
import { XCircle, Mail, Phone } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { SubmitButton } from '@/components/Form/Buttons';
import { AddGuestsProps, ValidationResult } from '@/types/events';
import { AddGuestsSchema } from '@/schemas/event';
import { addGuests } from '@/actions/event';
import { Button } from '@/components/ui/button';

const AddGuests = ({ open, setOpen, eventSlug }: AddGuestsProps) => {
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
            const result = await addGuests(values, eventSlug);

            if (result.success && result.data) {
                toast.success(result.message);
                console.log(result.data);
                setLastResult(result.data.validatedData);
                // form.reset();
            } else {
                toast.error(result.message);
                setLastResult(null);

                // Handle validation errors
                if (result.errors) {
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

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            form.reset();
            setLastResult(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Guests</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {lastResult
                        ? 'Thank you. your guests have been invited. See below the results of which emails and phone numbers were accepted, and which need fixing.'
                        : `Add guests below either by email or phone number. All guests will receive an invite to the site if they aren't already a member, as well as added to your event.`}
                </DialogDescription>
                {lastResult ? (
                    <>
                        {lastResult.validEmails &&
                            lastResult.validEmails.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-green-600 flex items-center gap-2 mb-2">
                                        <Mail className="h-4 w-4" />
                                        Valid Emails (
                                        {lastResult.validEmails.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {lastResult.validEmails.map(
                                            (email, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="bg-green-50 text-green-700 border-green-200"
                                                >
                                                    {email}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Invalid Emails */}
                        {lastResult.invalidEmails &&
                            lastResult.invalidEmails.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-2">
                                        <XCircle className="h-4 w-4" />
                                        Invalid Emails (
                                        {lastResult.invalidEmails.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {lastResult.invalidEmails.map(
                                            (email, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="bg-red-50 text-red-700 border-red-200"
                                                >
                                                    {email}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Valid Phone Numbers */}
                        {lastResult.validPhoneNumbers &&
                            lastResult.validPhoneNumbers.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-green-600 flex items-center gap-2 mb-2">
                                        <Phone className="h-4 w-4" />
                                        Valid Phone Numbers (
                                        {lastResult.validPhoneNumbers.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {lastResult.validPhoneNumbers.map(
                                            (phone, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="bg-green-50 text-green-700 border-green-200"
                                                >
                                                    {phone.formatted}{' '}
                                                    {phone.country &&
                                                        `(${phone.country})`}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Invalid Phone Numbers */}
                        {lastResult.invalidPhoneNumbers &&
                            lastResult.invalidPhoneNumbers.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-2">
                                        <XCircle className="h-4 w-4" />
                                        Invalid Phone Numbers (
                                        {lastResult.invalidPhoneNumbers.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {lastResult.invalidPhoneNumbers.map(
                                            (phone, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="bg-red-50 text-red-700 border-red-200"
                                                >
                                                    {phone}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        <Button
                            type="button"
                            className="capitalize"
                            size="lg"
                            onClick={() => handleOpenChange(false)}
                        >
                            Close
                        </Button>
                    </>
                ) : (
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
                                            Separate multiple emails with commas
                                            or new lines
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
                                            commas or new lines
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {form.formState.errors.root && (
                                <div className="text-sm font-medium text-destructive">
                                    {form.formState.errors.root.message}
                                </div>
                            )}
                            <SubmitButton
                                text="Validate & Add Guests"
                                className="w-full"
                                isPending={isPending}
                            />
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddGuests;
