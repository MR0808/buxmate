'use client';

import { useState, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { MessageSquare, RefreshCw } from 'lucide-react';
import parsePhoneNumber from 'libphonenumber-js';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { verifyPhoneOTP, resendPhoneOTP } from '@/actions/phone-verification';
import { PhoneVerificationFormProps } from '@/types/register';
import { OTPSchema } from '@/schemas/register';

const PhoneVerificationForm = ({
    userId,
    phoneNumber,
    email,
    password,
    onNext
}: PhoneVerificationFormProps) => {
    const [isPending, startTransition] = useTransition();
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const phoneNumberFormat = parsePhoneNumber(phoneNumber);

    const form = useForm<z.infer<typeof OTPSchema>>({
        resolver: zodResolver(OTPSchema),
        defaultValues: { otp: '' }
    });

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const onSubmit = (values: z.infer<typeof OTPSchema>) => {
        startTransition(async () => {
            const result = await verifyPhoneOTP(
                userId,
                values.otp,
                email,
                password
            );
            if (result.error) {
                toast.error(result.error, { position: 'top-center' });
                form.setError('otp', { message: result.error });
            } else {
                toast.success('Phone number verified successfully!', {
                    position: 'top-center'
                });
                onNext();
            }
        });
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;

        setIsResending(true);
        const result = await resendPhoneOTP(userId);
        setIsResending(false);

        if (result.error) {
            toast.error(result.error, { position: 'top-center' });
        } else {
            toast.success('New SMS code sent!', { position: 'top-center' });
            setCountdown(60);
            form.reset();
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center 2xl:mb-10 mb-5">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-medium">Verify Your Phone</h4>
                <div className="text-default-500  text-base">
                    We&apos;ve sent a 6-digit code to{' '}
                    <strong>
                        {phoneNumberFormat
                            ? phoneNumberFormat.formatNational()
                            : ''}
                    </strong>
                </div>
                <div className="text-default-500  text-base">
                    Please enter it below
                </div>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="flex justify-center">
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-center" />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col space-y-3">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? 'Verifying...' : 'Verify Phone Number'}
                        </Button>

                        <div className="text-center">
                            <div onClick={handleResendOTP} className="text-sm">
                                {isResending ? (
                                    <div className="flex flex-row justify-center cursor-default hover:none">
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </div>
                                ) : countdown > 0 ? (
                                    <div className="cursor-default">
                                        Resend in {countdown}s
                                    </div>
                                ) : (
                                    <div className="hover:underline cursor-pointer hover:text-gray-500">
                                        Resend Code
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default PhoneVerificationForm;
