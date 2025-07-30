'use client';

import Link from 'next/link';
import { useForm, SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    PasswordInputAuth,
    SubmitButton
} from '@/components/Form/FormInputAuth';
import { LoginSchema } from '@/schemas/auth';
import { login } from '@/actions/login';

const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackURL = searchParams.get('callbackURL') || '/';

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: true
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        startTransition(async () => {
            // const { error, emailVerified, phoneVerified } = await login(values);
            const data = await login(values);
            console.log(data);

            const { error, emailVerified, phoneVerified } = data;

            if (error) {
                toast.error(error, { position: 'top-center' });
            } else {
                toast.success('Log in successful', { position: 'top-center' });

                if (!emailVerified) {
                    router.push('/auth/verify-email');
                } else if (!phoneVerified) {
                    router.push('/auth/verify-phone');
                } else if (emailVerified && phoneVerified) {
                    router.push(callbackURL);
                }
            }
        });
    };

    const onError: SubmitErrorHandler<z.infer<typeof LoginSchema>> = (
        errors
    ) => {
        const errorMessages = Object.entries(errors).map(([field, error]) => (
            <li key={field}>{error.message || `Invalid ${field}`}</li>
        ));

        toast.dismiss();

        toast.error('There were errors in your login', {
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
                <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({ field }) => (
                                <FormItem className={cn('flex flex-row')}>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className={cn('gap-0')}>
                                        Keep me signed in
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Link
                        href="/auth/forgot-password"
                        className="text-sm text-default-800 dark:text-default-400 leading-6 font-medium"
                    >
                        Forgot Password?
                    </Link>
                </div>
                <SubmitButton
                    text="Login"
                    className="w-full"
                    isPending={isPending}
                />
            </form>
        </Form>
    );
};

export default LoginForm;
