'use client';

import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const SocialLogin = ({ action }: { action: string }) => {
    const [isPending, setIsPending] = useState(false);

    async function handleClick() {
        await signIn.social({
            provider: 'google',
            callbackURL: '/',
            errorCallbackURL: '/auth/login/error',
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true);
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                }
            }
        });
    }
    return (
        <ul className="flex">
            <li className="flex-1">
                <Image
                    width={350}
                    height={80}
                    className="w-full h-full cursor-pointer"
                    src={
                        action === 'register'
                            ? '/images/assets/signupgoogle.png'
                            : '/images/assets/signingoogle.png'
                    }
                    alt={
                        action === 'register'
                            ? 'Sign up with Google'
                            : 'Sign in with Google'
                    }
                    onClick={handleClick}
                />
            </li>
        </ul>
    );
};

export default SocialLogin;
