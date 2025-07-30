'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Phone } from 'lucide-react';
import { Country } from 'react-phone-number-input';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/phone-input';
import { addPhoneNumber } from '@/actions/phone-verification';
import { PhoneNumberFormProps } from '@/types/register';
import { PhoneSchema } from '@/schemas/register';

const PhoneNumberForm = ({
    userId,
    onNext,
    defaultCountry
}: PhoneNumberFormProps) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof PhoneSchema>>({
        resolver: zodResolver(PhoneSchema),
        defaultValues: { phoneNumber: '' }
    });

    const onSubmit = (values: z.infer<typeof PhoneSchema>) => {
        startTransition(async () => {
            const result = await addPhoneNumber(userId, values.phoneNumber);
            if (result.error) {
                toast.error(result.error, { position: 'top-center' });
                form.setError('phoneNumber', { message: result.error });
            } else {
                toast.success('SMS verification code sent!', {
                    position: 'top-center'
                });
                onNext(values.phoneNumber);
            }
        });
    };

    return (
        <div>
            <div className="text-center 2xl:mb-10 mb-5">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-medium">Add Phone Number</h4>
                <div className="text-default-500  text-base">
                    We&apos;ll send you an SMS verification code to secure your
                    account. Phone numbers are used to only send messages
                    related to events, we will not sell your phone number or
                    spam you.
                </div>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    {/* <Input
                                        {...field}
                                        placeholder="+1 (555) 123-4567"
                                        type="tel"
                                    /> */}
                                    <PhoneInput
                                        {...field}
                                        defaultCountry={
                                            defaultCountry.isoCode as Country
                                        }
                                        placeholder="Enter a phone number"
                                    />
                                </FormControl>
                                <FormMessage className="text-center" />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending
                            ? 'Sending SMS...'
                            : 'Send Verification Code'}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default PhoneNumberForm;
