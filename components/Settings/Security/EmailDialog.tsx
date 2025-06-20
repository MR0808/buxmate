'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useTransition } from 'react';

import {
    Dialog,
    DialogContent,
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
import FormError from '@/components/Form/FormError';
import FormSuccess from '@/components/Form/FormSuccess';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { EmailDialogProps } from '@/types/security';
import { cn } from '@/lib/utils';
import { ChangeEmailSchema, VerifyOtpSchema } from '@/schemas/security';
import { requestOTP, verifyOTP } from '@/actions/email';
import maskEmail from '@/utils/maskEmail';

type Step = 'input' | 'verify' | 'success';

const EmailDialog = ({
    open,
    setOpen,
    initialEmail = 'user@example.com'
}: EmailDialogProps) => {
    const [step, setStep] = useState<Step>('verify');
    const [error, setError] = useState({ error: false, message: '' });
    const [currentEmail] = useState(initialEmail);
    const [newEmail, setNewEmail] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [cooldownTime, setCooldownTime] = useState(0);
    const [isPendingInput, startTransitionInput] = useTransition();
    const [isPendingVerify, startTransitionVerify] = useTransition();

    const otpPending = false;

    const handleOpenChange = (newState: boolean) => {
        setOpen(newState);
        if (!newState) {
            setStep('input');
            setNewEmail('');
            setOtp('');
            setMaskedEmail('');
            setCooldownTime(0);
        }
    };

    const handleStartOver = () => {
        setStep('input');
        setNewEmail('');
        setOtp('');
        setMaskedEmail('');
        setCooldownTime(0);
    };

    const formInput = useForm<z.infer<typeof ChangeEmailSchema>>({
        resolver: zodResolver(ChangeEmailSchema),
        defaultValues: {
            currentEmail: initialEmail,
            newEmail: ''
        }
    });

    const onSubmitInput = (values: z.infer<typeof ChangeEmailSchema>) => {
        startTransitionInput(async () => {
            const data = await requestOTP(values);
            if (!data.success) {
                setError({ error: true, message: data.message });
            }
            if (data.cooldownTime) {
                setCooldownTime(data.cooldownTime);

                const interval = setInterval(() => {
                    setCooldownTime((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                clearInterval(interval);
            }
            if (data.success) {
                setStep('verify');
                setNewEmail(values.newEmail);
                setMaskedEmail(maskEmail(values.newEmail));
            }
        });
    };

    const formVerify = useForm<z.infer<typeof VerifyOtpSchema>>({
        resolver: zodResolver(VerifyOtpSchema),
        defaultValues: {
            currentEmail,
            newEmail,
            otp: ''
        }
    });

    const onSubmitVerify = (values: z.infer<typeof VerifyOtpSchema>) => {
        startTransitionVerify(async () => {
            const data = await verifyOTP(values);
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
            //     setStep('verify');
            //     setNewEmail(values.newEmail);
            //     setMaskedEmail(maskEmail(values.newEmail));
            // }
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                {step === 'input' && (
                    <>
                        <DialogTitle className="text-center">
                            <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                            <div className="text-lg font-semibold">
                                Change your email address
                            </div>
                        </DialogTitle>
                        <div className="space-y-9">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mt-2">
                                    Current email:{' '}
                                    <span className="font-medium">
                                        {currentEmail}
                                    </span>
                                </p>
                            </div>
                            {error.error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {error.message}
                                        {cooldownTime > 0 && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <Clock className="h-3 w-3" />
                                                <span className="text-xs">
                                                    Try again in {cooldownTime}{' '}
                                                    seconds
                                                </span>
                                            </div>
                                        )}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <Form {...formInput}>
                                <form
                                    className="space-y-4"
                                    onSubmit={formInput.handleSubmit(
                                        onSubmitInput
                                    )}
                                >
                                    <input
                                        type="hidden"
                                        name="currentEmail"
                                        value={currentEmail}
                                    />

                                    <div className="space-y-2">
                                        <FormField
                                            control={formInput.control}
                                            name="newEmail"
                                            render={({ field }) => (
                                                <FormItem
                                                    className={cn('w-full')}
                                                >
                                                    <FormLabel className="mb-6">
                                                        New Email Address
                                                    </FormLabel>
                                                    <FormControl>
                                                        <AccountFormInput
                                                            {...field}
                                                            name="newEmail"
                                                            type="email"
                                                            placeholder="Enter your new email address"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <SubmitButton
                                        text="Send Verification Code"
                                        isPending={
                                            isPendingInput || cooldownTime > 0
                                        }
                                        className="w-full mt-6"
                                    />
                                </form>
                            </Form>
                        </div>
                    </>
                )}
                {step === 'verify' && (
                    <>
                        <DialogTitle className="text-center">
                            <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                            <div className="text-lg font-semibold">
                                Verify Your New Email
                            </div>
                        </DialogTitle>
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mt-2">
                                    We sent a 6-digit code to{' '}
                                    <span className="font-medium">
                                        {maskedEmail}
                                    </span>
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mt-2">
                                    Enter verification code below
                                </p>
                            </div>

                            {/* {otpState?.success && (
                    <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{otpState.message}</AlertDescription>
                    </Alert>
                )} */}

                            {/* {verifyState && !verifyState.success && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {verifyState.message}
                        </AlertDescription>
                    </Alert>
                )} */}
                            <Form {...formVerify}>
                                <form
                                    className="space-y-4"
                                    onSubmit={formVerify.handleSubmit(
                                        onSubmitVerify
                                    )}
                                >
                                    <div className="space-y-2">
                                        <FormField
                                            control={formVerify.control}
                                            name="otp"
                                            render={({ field }) => (
                                                <FormItem
                                                    className={cn('w-full')}
                                                >
                                                    <FormControl>
                                                        <div className="flex justify-center">
                                                            <InputOTP
                                                                maxLength={6}
                                                                {...field}
                                                            >
                                                                <InputOTPGroup>
                                                                    <InputOTPSlot
                                                                        index={
                                                                            0
                                                                        }
                                                                    />
                                                                    <InputOTPSlot
                                                                        index={
                                                                            1
                                                                        }
                                                                    />
                                                                    <InputOTPSlot
                                                                        index={
                                                                            2
                                                                        }
                                                                    />
                                                                    <InputOTPSlot
                                                                        index={
                                                                            3
                                                                        }
                                                                    />
                                                                    <InputOTPSlot
                                                                        index={
                                                                            4
                                                                        }
                                                                    />
                                                                    <InputOTPSlot
                                                                        index={
                                                                            5
                                                                        }
                                                                    />
                                                                </InputOTPGroup>
                                                            </InputOTP>
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex gap-5 mx-10 mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleStartOver}
                                            className="flex-1 w-1/2"
                                            size="lg"
                                        >
                                            Back
                                        </Button>
                                        <SubmitButton
                                            text="Verify"
                                            isPending={isPendingVerify}
                                            className="w-1/2"
                                        />
                                    </div>
                                </form>
                            </Form>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    Code expires in 15 minutes
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

const InputContent = () => {};

export default EmailDialog;
