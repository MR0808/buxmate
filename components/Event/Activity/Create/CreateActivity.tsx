'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitErrorHandler } from 'react-hook-form';
import { useState, useTransition } from 'react';

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
    FormLabel
} from '@/components/ui/form';
import { SubmitButton } from '@/components/Form/Buttons';
import { AccountFormInput } from '@/components/Form/FormInput';
import { cn } from '@/lib/utils';
import { CreateActivityProps } from '@/types/events';
import { CreateActivitySchema } from '@/schemas/event';
import Autocomplete from '@/components/Autocomplete/Autocomplete';

const CreateActivity = ({ open, setOpen }: CreateActivityProps) => {
    const [error, setError] = useState({ error: false, message: '' });
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof CreateActivitySchema>>({
        resolver: zodResolver(CreateActivitySchema),
        defaultValues: {
            placeId: '',
            formattedAddress: '',
            latitude: 0,
            longitude: 0
        }
    });

    const onSubmit = (values: z.infer<typeof CreateActivitySchema>) => {
        startTransition(async () => {
            console.log(values);
            // const data = await sendEmailChangeOTP(values);
            // if (!data.success) {
            //     setError({ error: true, message: data.message });
            // }
            // if (data.cooldownTime) {
            //     setCooldownTime(data.cooldownTime);
            //     const interval = setInterval(() => {
            //         setCooldownTime((prev) => {
            //             if (prev <= 1) {
            //                 clearInterval(interval);
            //                 return 0;
            //             }
            //             return prev - 1;
            //         });
            //     }, 1000);
            //     clearInterval(interval);
            // }
            // if (data.success) {
            //     formVerify.setValue('newEmail', values.newEmail);
            //     setError({ error: false, message: '' });
            //     setStep('verify');
            //     setNewEmail(values.newEmail);
            //     setMaskedEmail(maskEmail(values.newEmail));
            // }
        });
    };

    const onError: SubmitErrorHandler<z.infer<typeof CreateActivitySchema>> = (
        errors
    ) => {
        setError({ error: true, message: 'error' });
    };

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
                        <div className="space-y-1">
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
                                                type="text"
                                                placeholder="Activity name"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Autocomplete />
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateActivity;
