'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Power } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';

const NavSignOutButton = () => {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleClick() {
        await signOut({
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true);
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("You've logged out. See you soon!");
                    router.push('/auth/login');
                }
            }
        });
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className=" w-full cursor-pointer flex items-center gap-2"
        >
            <Power className="w-4 h-4" />
            Log Out
        </button>
    );
};

export default NavSignOutButton;
