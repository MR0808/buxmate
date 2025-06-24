'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { CreateEventSchema } from '@/schemas/event';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type FormData = z.infer<typeof CreateEventSchema>;

const steps = [
    {
        id: 1,
        title: 'Event Information',
        description: 'Tell us the basic information for the event',
        fields: ['title', 'description', 'date', 'image'] as (keyof FormData)[]
    },
    {
        id: 2,
        title: 'Logistical Information',
        description: 'What are the logistics of the event?',
        fields: ['state', 'timezone', 'currency'] as (keyof FormData)[]
    },
    {
        id: 3,
        title: 'Review & Submit',
        description: 'Review your information',
        fields: [] as (keyof FormData)[]
    }
];

const StepIndicator = ({
    currentStep,
    totalSteps
}: {
    currentStep: number;
    totalSteps: number;
}) => {
    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between">
                {Array.from({ length: totalSteps }, (_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    const isUpcoming = stepNumber > currentStep;

                    return (
                        <div key={stepNumber} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                      ${
                          isCompleted
                              ? 'bg-green-500 text-white'
                              : isCurrent
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-500'
                      }
                    `}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        stepNumber
                                    )}
                                </div>
                                <div className="mt-2 text-xs text-center max-w-20">
                                    <div
                                        className={`font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}
                                    >
                                        Step {stepNumber}
                                    </div>
                                </div>
                            </div>
                            {index < totalSteps - 1 && (
                                <div
                                    className={`
                      flex-1 h-0.5 mx-4 transition-all duration-200
                      ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                    `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Progress bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                    style={{
                        width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
                    }}
                />
            </div>
        </div>
    );
};

const CreateEventForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof CreateEventSchema>>({
        resolver: zodResolver(CreateEventSchema),
        defaultValues: {
            title: '',
            description: '',
            date: new Date(),
            image: [],
            state: '',
            timezone: '',
            currency: ''
        }
    });

    const validateCurrentStep = async () => {
        const currentStepFields = steps[currentStep - 1].fields;
        if (currentStepFields.length === 0) return true;

        const result = await form.trigger(currentStepFields);
        return result;
    };

    const nextStep = async () => {
        const isValid = await validateCurrentStep();
        if (isValid && currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = (values: z.infer<typeof CreateEventSchema>) => {
        startTransition(async () => {
            // await authClient.updateUser({
            //     dateOfBirth: values.dateOfBirth,
            //     fetchOptions: {
            //         onError: (ctx) => {
            //             toast.error(ctx.error.message);
            //         },
            //         onSuccess: async (ctx) => {
            //             setDate(values.dateOfBirth);
            //             if (userSession)
            //                 await logPersonalUpdated(
            //                     userSession?.user.id,
            //                     'user.dateofbirth_updated',
            //                     ['dateofbirth'],
            //                     {
            //                         updatedFields: {
            //                             dateofbirth: values.dateOfBirth
            //                         }
            //                     }
            //                 );
            //             refetch();
            //             setEdit(false);
            //             toast.success('Date of birth successfully updated');
            //             form.reset(values);
            //         }
            //     }
            // });
        });
    };

    const renderStepContent = () => {
        const currentStepData = steps[currentStep - 1];

        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-[240px] pl-3 text-left font-normal',
                                                            !field.value &&
                                                                'text-muted-foreground'
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                'PPP'
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() ||
                                                        date <
                                                            new Date(
                                                                '1900-01-01'
                                                            )
                                                    }
                                                    captionLayout="dropdown"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="timezone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Timezone</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                );

            case 3:
                const formData = form.getValues();
                return (
                    <div className="space-y-6">
                        <div className="grid gap-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Personal Information
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    {/* <p>
                                        <span className="font-medium">
                                            Name:
                                        </span>{' '}
                                        {formData.firstName} {formData.lastName}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Email:
                                        </span>{' '}
                                        {formData.email}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Phone:
                                        </span>{' '}
                                        {formData.phone}
                                    </p> */}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Address Information
                                </h3>
                                {/* <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p>
                                        <span className="font-medium">
                                            Address:
                                        </span>{' '}
                                        {formData.address}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            City:
                                        </span>{' '}
                                        {formData.city}, {formData.postalCode}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Country:
                                        </span>{' '}
                                        {formData.country}
                                    </p>
                                </div> */}
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Preferences
                                </h3>
                                {/* <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p>
                                        <span className="font-medium">
                                            Newsletter:
                                        </span>{' '}
                                        {formData.newsletter ? 'Yes' : 'No'}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Notifications:
                                        </span>{' '}
                                        {formData.notifications ? 'Yes' : 'No'}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Marketing:
                                        </span>{' '}
                                        {formData.marketing ? 'Yes' : 'No'}
                                    </p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };
    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Multi-Step Registration Form</CardTitle>
                    <CardDescription>
                        Complete all steps to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <StepIndicator
                        currentStep={currentStep}
                        totalSteps={steps.length}
                    />

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">
                                    {steps[currentStep - 1].title}
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    {steps[currentStep - 1].description}
                                </p>

                                {renderStepContent()}
                            </div>

                            <div className="flex justify-between pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                >
                                    Previous
                                </Button>

                                {currentStep < steps.length ? (
                                    <Button type="button" onClick={nextStep}>
                                        Next
                                    </Button>
                                ) : (
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? 'Submitting...' : 'Submit'}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
export default CreateEventForm;
