'use client';

import { toast } from 'sonner';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { InvitationResponseFormProps } from '@/types/invite';
import { respondToInvitation } from '@/actions/invitations';
import Link from 'next/link';

export function InvitationResponseForm({
    inviteToken,
    slug
}: InvitationResponseFormProps) {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [response, setResponse] = useState<null | 'ACCEPTED' | 'DECLINED'>(
        null
    );

    const handleResponse = (inviteResponse: 'ACCEPTED' | 'DECLINED') => {
        startTransition(async () => {
            try {
                const result = await respondToInvitation({
                    response: inviteResponse,
                    inviteToken
                });

                if (!result.success) {
                    toast.error(result.message);
                }

                if (result.success) {
                    toast.success(result.message);
                    setResponse(inviteResponse);
                    setSuccess(true);
                }
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Failed to respond to invitation'
                );
            }
        });
    };

    return !success ? (
        <div className="flex flex-col justify-center items-center">
            <div className="flex gap-4">
                <Button
                    onClick={() => handleResponse('ACCEPTED')}
                    disabled={isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer "
                >
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                </Button>

                <Button
                    onClick={() => handleResponse('DECLINED')}
                    disabled={isPending}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 cursor-pointer"
                >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                </Button>
            </div>
            <div className="text-sm text-gray-500 mt-6">
                Accepting is not committing to payment, but will let you see the
                event further and choose which activities you will be attending.
            </div>
        </div>
    ) : (
        <div className="flex gap-1 flex-col">
            <div className="text-sm text-gray-500">
                Thank you for responding to the event.
            </div>
            {response == 'ACCEPTED' ? (
                <>
                    <div className="text-sm text-gray-500">
                        <Link
                            href={`/event/${slug}`}
                            className="text-black hover:underline"
                        >
                            Click here
                        </Link>{' '}
                        to go to the event page.
                    </div>
                    <div className="text-sm text-gray-500">
                        {' '}
                        If you do not have an account, you will need to register
                        first.
                    </div>
                </>
            ) : (
                <div className="text-sm text-gray-500">
                    If you change your mind, please contact the host.
                </div>
            )}
        </div>
    );
}
