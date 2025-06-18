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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { register } from '@/actions/register';
import { RegisterSchema } from '@/schemas/auth';
import {
    PasswordInputAuth,
    SubmitButton
} from '@/components/Form/FormInputAuth';

const RegisterForm = () => {
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: '',
            lastName: '',
            email: '',
            password: '',
            overEighteen: false,
            terms: false
        }
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setSuccess(false);

        startTransition(async () => {
            const { error } = await register(values);
            if (error) {
                toast.error(error, { position: 'top-center' });
            } else {
                toast.success(
                    'Registration complete. Please verify your email.',
                    { position: 'top-center' }
                );
                setSuccess(true);
            }
        });
    };

    const onError: SubmitErrorHandler<z.infer<typeof RegisterSchema>> = (
        errors
    ) => {
        const errorMessages = Object.entries(errors).map(([field, error]) => (
            <li key={field}>{error.message || `Invalid ${field}`}</li>
        ));

        toast.dismiss();

        toast.error('There were errors in your registration', {
            position: 'top-center',
            description: (
                <ul className="list-disc ml-4 space-y-1">{errorMessages}</ul>
            ),
            closeButton: true,
            duration: Infinity
        });
    };

    return !success ? (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="space-y-4"
            >
                <div className="flex flex-row space-x-2">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
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
                <div className="space-y-2">
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
                            name="overEighteen"
                            render={({ field }) => (
                                <FormItem className={cn('flex flex-row')}>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className={cn('gap-0')}>
                                        I confirm that I am over 18 years old
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <FormField
                            control={form.control}
                            name="terms"
                            render={({ field }) => (
                                <FormItem className={cn('flex flex-row')}>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className={cn('gap-0')}>
                                        You must accept our terms and conditions
                                        and privacy policy
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <SubmitButton
                    text="Create an Account"
                    className="w-full"
                    isPending={isPending}
                />
            </form>
        </Form>
    ) : (
        <div className="text-default-500 text-base text-center">
            You have successfully registered. Please check your email for the
            verification link.
        </div>
    );
};

export default RegisterForm;
