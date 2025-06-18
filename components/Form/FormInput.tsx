import { forwardRef } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FormInputProps = {
    name: string;
    type?: string;
    label?: string;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
};

type FormSliderInputProps = {
    name: string;
    type?: string;
    min?: number;
    max?: number;
    value?: number;
    step?: number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FormInput = ({
    label,
    name,
    type,
    defaultValue,
    placeholder
}: FormInputProps) => {
    return (
        <div className="mb-2">
            <Label htmlFor={name} className="capitalize">
                {label || name}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required
            />
        </div>
    );
};

export const AccountFormInput = forwardRef<HTMLInputElement, FormInputProps>(
    function AccountFormInput({ name, type, placeholder, ...props }, ref) {
        return (
            <Input
                name={name}
                type={type}
                placeholder={placeholder}
                {...props}
                className={cn("h-12 rounded-xl px-6 py-3 text-sm font-normal")}
            />
        );
    }
);

export const AddFormInput = forwardRef<HTMLInputElement, FormInputProps>(
    function AddFormInput({ name, type, placeholder, ...props }, ref) {
        return (
            <Input
                name={name}
                type={type}
                placeholder={placeholder}
                {...props}
                className={cn(
                    "block h-14 w-full rounded-lg border-neutral-200 bg-white px-5"
                )}
            />
        );
    }
);

export const AddFormSliderInput = forwardRef<
    HTMLInputElement,
    FormSliderInputProps
>(function AddFormSliderInput(
    { name, type, min, max, value, step, onChange, ...props },
    ref
) {
    return (
        <Input
            name={name}
            type={type}
            {...props}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className={cn(
                "block h-14 w-24 rounded-lg border-neutral-200 bg-white px-5"
            )}
        />
    );
});

export const AddFormTextArea = forwardRef<HTMLInputElement, FormInputProps>(
    function AddFormTextArea({ name, placeholder = "", ...props }, ref) {
        return (
            <Textarea
                name={name}
                {...props}
                className={cn(
                    "block h-28 w-full rounded-lg border-neutral-200 bg-white p-5"
                )}
                placeholder={placeholder}
            />
        );
    }
);
