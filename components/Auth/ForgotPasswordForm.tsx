'use client';

import { useForm, SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition, useState } from 'react';
import { toast } from 'sonner';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/Form/FormInputAuth';
import { EmailSchema } from '@/schemas/auth';
import { forgetPassword } from '@/lib/auth-client';

const ForgotPasswordForm = () => {
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof EmailSchema>>({
        resolver: zodResolver(EmailSchema),
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = (values: z.infer<typeof EmailSchema>) => {
        setSuccess(false);
        startTransition(async () => {
            await forgetPassword({
                email: values.email,
                redirectTo: '/auth/reset-password',
                fetchOptions: {
                    onError: (ctx) => {
                        toast.error(ctx.error.message);
                    },
                    onSuccess: async () => {
                        setSuccess(true);
                        toast.success(
                            'Reset password email sent successfully!'
                        );
                    }
                }
            });
        });
    };

    const onError: SubmitErrorHandler<z.infer<typeof EmailSchema>> = (
        errors
    ) => {
        toast.dismiss();

        toast.error('Please enter a valid email', {
            position: 'top-center',
            closeButton: true,
            duration: Infinity
        });
    };

    return !success ? (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="mt-5 2xl:mt-7 space-y-4"
            >
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <SubmitButton
                    text="Reset Password"
                    className="w-full"
                    isPending={isPending}
                />
            </form>
        </Form>
    ) : (
        <div className="text-default-500 text-base text-center">
            Your reset password email has been resent.
        </div>
    );
};

export default ForgotPasswordForm;
