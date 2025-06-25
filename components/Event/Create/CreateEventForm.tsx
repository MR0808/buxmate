'use client';

import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { CreateEventSchema } from '@/schemas/event';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadField from '@/components/Event/Create/ImageUploadField';
import type { AddEventProps } from '@/types/events';
import DateField from '@/components/Event/Create/DateField';
import LocationField from '@/components/Event/Create/LocationField';
import CurrencyField from '@/components/Event/Create/CurrencyField';
import StepIndicator from '@/components/Event/Create/StepIndicator';
import TimezoneField from '@/components/Event/Create/TimezoneField';
import Image from 'next/image';

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

const CreateEventForm = ({
    currencies,
    defaultCurrency,
    countryProp,
    countries,
    states
}: AddEventProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [url, setUrl] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [currency, setCurrency] = useState(defaultCurrency?.name || '');

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof CreateEventSchema>>({
        resolver: zodResolver(CreateEventSchema),
        defaultValues: {
            title: '',
            description: '',
            date: new Date(),
            image: '',
            state: '',
            country: countryProp?.id || '',
            timezone: 'Australia/Melbourne',
            currency: defaultCurrency?.id || ''
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
                        <DateField />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Image</FormLabel>
                                    <FormControl>
                                        <ImageUploadField
                                            bucket="eventimages"
                                            name="image"
                                            setUrl={setUrl}
                                            url={url}
                                        />
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
                        <LocationField countries={countries} states={states} />
                        <TimezoneField />
                        <CurrencyField
                            currencies={currencies}
                            defaultCurrency={defaultCurrency}
                            currentStep={currentStep}
                            currency={currency}
                            setCurrency={setCurrency}
                        />
                    </div>
                );

            case 3:
                const formData = form.getValues();
                return (
                    <div className="space-y-6">
                        <div className="grid gap-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Event Information
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p>
                                        <span className="font-medium">
                                            Title:
                                        </span>{' '}
                                        {form.getValues('title')}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Description:
                                        </span>{' '}
                                        {form.getValues('description')}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Date:
                                        </span>{' '}
                                        {format(
                                            form.getValues('date'),
                                            'd MMMM, yyyy'
                                        )}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Image:
                                        </span>{' '}
                                        <Image
                                            src={
                                                url ||
                                                '/images/assets/profile.jpg'
                                            }
                                            alt={form.getValues('title')}
                                            width={200}
                                            height={200}
                                        />
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Logistical Information
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p>
                                        <span className="font-medium">
                                            Location:
                                        </span>{' '}
                                        {/* {formData.address} */}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Timezone:
                                        </span>{' '}
                                        {form.getValues('timezone')}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Currency:
                                        </span>{' '}
                                        {currency}
                                    </p>
                                </div>
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
