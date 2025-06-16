'use client';

import { useForm, SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { toast } from 'sonner';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form';
import {
    PasswordInputAuth,
    SubmitButton
} from '@/components/Form/FormInputAuth';
import { ResetPasswordSchema } from '@/schemas/auth';
import { resetPassword } from '@/lib/auth-client';

const ResetPasswordForm = ({ token }: { token: string }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
        startTransition(async () => {
            await resetPassword({
                newPassword: values.password,
                token,
                fetchOptions: {
                    onError: (ctx) => {
                        toast.error(ctx.error.message);
                    },
                    onSuccess: () => {
                        toast.dismiss();
                        toast.success('Password reset successfully.');
                        router.push('/auth/login');
                    }
                }
            });
        });
    };

    const onError: SubmitErrorHandler<z.infer<typeof ResetPasswordSchema>> = (
        errors
    ) => {
        const errorMessages = Object.entries(errors).map(([field, error]) => (
            <li key={field}>{error.message || `Invalid ${field}`}</li>
        ));

        toast.dismiss();

        toast.error('There were errors while resettting password', {
            position: 'top-center',
            description: (
                <ul className="list-disc ml-4 space-y-1">{errorMessages}</ul>
            ),
            closeButton: true,
            duration: Infinity
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="mt-5 2xl:mt-7 space-y-4"
            >
                <div className="mt-3.5 space-y-2">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <PasswordInputAuth
                                        {...field}
                                        label="Password"
                                        name="password"
                                        type="password"
                                        defaultValue=""
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="mt-3.5 space-y-2">
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <PasswordInputAuth
                                        {...field}
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                        defaultValue=""
                                    />
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
    );
};

export default ResetPasswordForm;
