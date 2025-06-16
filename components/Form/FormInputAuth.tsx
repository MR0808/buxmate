'use client';
import { forwardRef } from 'react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ReloadIcon } from '@radix-ui/react-icons';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FormInputProps = {
    name: string;
    type: string;
    label?: string;
    defaultValue?: string;
};

type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
    className?: string;
    text?: string;
    size?: btnSize;
    isPending: boolean;
    disabledCheck?: boolean;
};

export const PasswordInputAuth = forwardRef<HTMLInputElement, FormInputProps>(
    function PasswordInputAuth(
        { label, name, type, defaultValue, ...props },
        ref
    ) {
        const [showPassword, setShowPassword] = useState(false);
        return (
            <>
                <Input
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    {...props}
                />
                <div
                    className="absolute translate-y-2/3 right-10 cursor-pointer"
                    tabIndex={-1}
                >
                    <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                            setShowPassword((prev) => !prev);
                        }}
                    >
                        {showPassword ? (
                            <Eye className="size-5" />
                        ) : (
                            <EyeOff className="size-5" />
                        )}
                    </Button>
                </div>
            </>
        );
    }
);

export const SubmitButton = ({
    className = '',
    text = 'submit',
    size = 'lg',
    isPending,
    disabledCheck = true
}: SubmitButtonProps) => {
    return (
        <Button
            type="submit"
            disabled={isPending || !disabledCheck}
            className={cn('capitalize', className)}
            size={size}
        >
            {isPending ? (
                <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                </>
            ) : (
                text
            )}
        </Button>
    );
};
