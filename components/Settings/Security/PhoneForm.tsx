'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTransition, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Country } from 'react-phone-number-input';
import parsePhoneNumber, { PhoneNumber } from 'libphonenumber-js';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';
import { PhoneInput } from '@/components/ui/phone-input';
import { authClient, useSession } from '@/lib/auth-client';
import { SubmitButton } from '@/components/Form/Buttons';
import { ChangePhoneSchema } from '@/schemas/security';
import { cn } from '@/lib/utils';
import { PhoneNumberProps } from '@/types/personal';
import { logPersonalUpdated } from '@/actions/audit/audit-personal';

const PhoneNumberForm = ({ userSession, defaultCountry }: PhoneNumberProps) => {
    const { data: currentUser, refetch } = useSession();
    const [user, setUser] = useState(userSession?.user);
    const [edit, setEdit] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<PhoneNumber | undefined>(
        userSession && userSession.user.phoneNumber
            ? parsePhoneNumber(userSession.user.phoneNumber)
            : undefined
    );
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (currentUser && currentUser.user) {
            setUser(currentUser?.user);
        }
    }, [currentUser]);

    const errorClass = 'pl-6';

    const form = useForm<z.infer<typeof PhoneSchema>>({
        resolver: zodResolver(PhoneSchema),
        defaultValues: {
            phoneNumber: user?.phoneNumber || ''
        }
    });

    const cancel = () => {
        form.reset();
        setEdit(!edit);
    };

    const onSubmit = (values: z.infer<typeof PhoneSchema>) => {
        startTransition(async () => {
            await authClient.updateUser({
                phoneNumber: values.phoneNumber,
                fetchOptions: {
                    onError: (ctx) => {
                        toast.error(ctx.error.message);
                    },
                    onSuccess: async () => {
                        refetch();
                        if (user && user.id)
                            await logPersonalUpdated(
                                user.id,
                                'user.phone_updated',
                                ['phoneNumber'],
                                {
                                    updatedFields: {
                                        phoneNumber: values.phoneNumber
                                    }
                                }
                            );
                        setEdit(false);
                        setPhoneNumber(parsePhoneNumber(values.phoneNumber));
                        toast.success('Phone number successfully updated');
                        form.reset(values);
                    }
                }
            });
        });
    };

    return (
        <div className="mt-8 border-b border-b-gray-200 pb-8">
            <div className="w-full md:w-3/5 flex flex-col gap-5">
                <div className="flex justify-between">
                    <h3 className="text-base font-semibold">Phone Number</h3>
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
                            className="w-full space-y-6"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <div className="flex flex-row gap-x-6">
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem className={cn('w-full')}>
                                            <FormControl>
                                                <PhoneInput
                                                    {...field}
                                                    defaultCountry={
                                                        defaultCountry.isoCode as Country
                                                    }
                                                    placeholder="Enter a phone number"
                                                />
                                            </FormControl>
                                            <FormMessage
                                                className={errorClass}
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex-1">
                                <SubmitButton
                                    text="update"
                                    isPending={isPending}
                                />
                            </div>
                        </form>
                    </Form>
                ) : (
                    <div
                        className={`${
                            !user?.phoneNumber && 'italic'
                        } text-base font-normal`}
                    >
                        {phoneNumber
                            ? phoneNumber.formatNational()
                            : 'Not specified'}
                    </div>
                )}
            </div>
        </div>
    );
};
export default PhoneNumberForm;
