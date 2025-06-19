'use client';

import { useState, useEffect } from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from '@/components/ui/input-otp';
import { CheckCircle, Mail, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { EmailDialogProps } from '@/types/security';
import { cn } from '@/lib/utils';

type Step = 'input' | 'verify' | 'success';

const EmailDialog = ({
    open,
    setOpen,
    initialEmail = 'user@example.com'
}: EmailDialogProps) => {
    const [step, setStep] = useState<Step>('input');
    const [currentEmail] = useState(initialEmail);
    const [newEmail, setNewEmail] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [cooldownTime, setCooldownTime] = useState(0);
    const otpPending = false;

    const handleOpenChange = (newState: boolean) => {
        setOpen(newState);

        if (!newState) {
            // Dialog is closing — run your cleanup or logic here
            console.log('Dialog closed');
        } else {
            console.log('Dialog opened');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader className={cn('mb-6')}>
                    <DialogTitle>Change Email Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-10">
                    <div>
                        <p className="text-sm text-gray-600 mt-1">
                            Current email:{' '}
                            <span className="font-medium">{currentEmail}</span>
                        </p>
                    </div>

                    {/* {otpState && !otpState.success && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {otpState.message}
                                {cooldownTime > 0 && (
                                    <div className="flex items-center gap-1 mt-2">
                                        <Clock className="h-3 w-3" />
                                        <span className="text-xs">
                                            Try again in {cooldownTime} seconds
                                        </span>
                                    </div>
                                )}
                            </AlertDescription>
                        </Alert>
                    )} */}

                    <form className="space-y-4">
                        <input
                            type="hidden"
                            name="currentEmail"
                            value={currentEmail}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="newEmail">New Email Address</Label>
                            <Input
                                id="newEmail"
                                name="newEmail"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Enter your new email address"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            // disabled={
                            //     otpPending ||
                            //     cooldownTime > 0 ||
                            //     !newEmail ||
                            //     !isValidEmail(newEmail)
                            // }
                            className="w-full"
                        >
                            {otpPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Verification Code'
                            )}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default EmailDialog;
