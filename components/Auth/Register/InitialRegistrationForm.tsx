'use client';

import { useForm, type SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { useTransition } from 'react';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { registerInitial } from '@/actions/register';
import { RegisterSchema } from '@/schemas/register';
import { PasswordInputAuth } from '@/components/Form/FormInputAuth';
import type { InitialRegistrationFormProps } from '@/types/register';

const InitialRegistrationForm = ({
    data,
    onNext
}: InitialRegistrationFormProps) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            overEighteen: data.overEighteen,
            terms: data.terms
        }
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        startTransition(async () => {
            const result = await registerInitial(values);
            if (result.error) {
                toast.error(result.error, { position: 'top-center' });
            } else if (result.userId) {
                toast.success('Account created! Please verify your email.', {
                    position: 'top-center'
                });
                onNext({ ...values, userId: result.userId });
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
        toast.error('Please fix the following errors:', {
            position: 'top-center',
            description: (
                <ul className="list-disc ml-4 space-y-1">{errorMessages}</ul>
            ),
            closeButton: true,
            duration: Number.POSITIVE_INFINITY
        });
    };

    return (
        <div>
            <div className="text-center 2xl:mb-10 mb-5">
                <h4 className="font-medium">Register</h4>
                <div className="text-default-500  text-base">
                    Register to start using Buxmate
                </div>
            </div>

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

                    <FormField
                        control={form.control}
                        name="overEighteen"
                        render={({ field }) => (
                            <FormItem
                                className={cn(
                                    'flex flex-row items-center space-x-2'
                                )}
                            >
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel className={cn('gap-0 text-sm')}>
                                    I confirm that I am over 18 years old
                                </FormLabel>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                            <FormItem
                                className={cn(
                                    'flex flex-row items-center space-x-2'
                                )}
                            >
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel className={cn('gap-0 text-sm')}>
                                    I accept the terms and conditions and
                                    privacy policy
                                </FormLabel>
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? 'Creating Account...' : 'Continue'}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default InitialRegistrationForm;
