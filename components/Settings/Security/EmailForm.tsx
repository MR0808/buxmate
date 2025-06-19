'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTransition, useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { authClient, useSession } from '@/lib/auth-client';
import { SubmitButton } from '@/components/Form/Buttons';
import { AccountFormInput } from '@/components/Form/FormInput';
import FormError from '@/components/Form/FormError';
import FormSuccess from '@/components/Form/FormSuccess';
import { ChangeEmailSchema, VerifyOtpSchema } from '@/schemas/security';
import { cn } from '@/lib/utils';
import { SessionProps } from '@/types/session';

const EmailForm = ({ userSession }: SessionProps) => {
    const { data: currentUser, refetch } = useSession();
    const [user, setUser] = useState(userSession?.user);
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [currentEmail] = useState(userSession?.user.email);
    const [newEmail, setNewEmail] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [cooldownTime, setCooldownTime] = useState(0);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (currentUser && currentUser.user) {
            setUser(currentUser?.user);
        }
    }, [currentUser]);

    const form = useForm<z.infer<typeof ChangeEmailSchema>>({
        resolver: zodResolver(ChangeEmailSchema),
        defaultValues: {
            currentEmail: user?.email || '',
            newEmail: ''
        }
    });

    const cancel = () => {
        form.reset();
        setEdit(!edit);
        setError(undefined);
        setSuccess(undefined);
    };

    const onSubmit = (values: z.infer<typeof ChangeEmailSchema>) => {
        startTransition(async () => {
            if (user?.email !== values.newEmail) {
            } else {
                cancel();
            }
        });
    };

    return (
        <div className="flex flex-col gap-5 border-b border-b-gray-200 pb-8">
            <div className="flex justify-between">
                <h3 className="font-semibold text-base">Email</h3>
                <div
                    className="cursor-pointer text-base font-normal hover:underline"
                    onClick={cancel}
                >
                    {edit ? 'Cancel' : 'Edit'}
                </div>
            </div>
            {edit ? (
                <Form {...form}>
                    <form
                        className="space-y-6 w-full"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-row gap-x-6">
                            <FormField
                                control={form.control}
                                name="newEmail"
                                render={({ field }) => (
                                    <FormItem className={cn('w-full')}>
                                        <FormControl>
                                            <AccountFormInput
                                                {...field}
                                                name="newEmail"
                                                type="email"
                                                placeholder="Email"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {(success || error) && (
                            <div className="flex flex-row gap-x-6">
                                <div className="basis-full">
                                    <FormError message={error} />
                                    <FormSuccess message={success} />
                                </div>
                            </div>
                        )}
                        <div className="flex-1">
                            <SubmitButton text="update" isPending={isPending} />
                        </div>
                    </form>
                </Form>
            ) : (
                <div
                    className={`${
                        !user?.email && 'italic'
                    } text-base font-normal`}
                >
                    {user?.email ? `${user.email}` : 'Not specified'}
                </div>
            )}
        </div>
    );
};
export default EmailForm;
