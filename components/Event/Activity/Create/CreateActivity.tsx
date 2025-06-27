'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitErrorHandler } from 'react-hook-form';
import { useState, useTransition } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
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
import { SubmitButton } from '@/components/Form/Buttons';
import { AccountFormInput } from '@/components/Form/FormInput';
import { cn } from '@/lib/utils';
import { CreateActivityProps } from '@/types/events';
import {
    CreateActivitySchema,
    type CreateActivityFormValues
} from '@/schemas/event';
import type { GooglePlaceResult } from '@/types/places';
import { GooglePlacesAutocomplete } from '@/components/Event/Activity/Create/GooglePlacesAutocomplete';

const CreateActivity = ({ open, setOpen }: CreateActivityProps) => {
    const [error, setError] = useState({ error: false, message: '' });
    const [isPending, startTransition] = useTransition();
    const [selectedPlace, setSelectedPlace] =
        useState<GooglePlaceResult | null>(null);

    const form = useForm<z.infer<typeof CreateActivitySchema>>({
        resolver: zodResolver(CreateActivitySchema),
        defaultValues: {
            placeId: '',
            formattedAddress: '',
            latitude: 0,
            longitude: 0
        }
    });

    const extractAddressComponents = (addressComponents: any[]) => {
        const components: any = {};

        addressComponents.forEach((component) => {
            const types = component.types;

            if (types.includes('street_number')) {
                components.streetNumber = component.long_name;
            }
            if (types.includes('route')) {
                components.route = component.long_name;
            }
            if (types.includes('locality')) {
                components.locality = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
                components.administrativeAreaLevel1 = component.long_name;
            }
            if (types.includes('administrative_area_level_2')) {
                components.administrativeAreaLevel2 = component.long_name;
            }
            if (types.includes('country')) {
                components.country = component.long_name;
            }
            if (types.includes('postal_code')) {
                components.postalCode = component.long_name;
            }
        });

        return components;
    };

    const handlePlaceSelect = (place: GooglePlaceResult) => {
        setSelectedPlace(place);

        console.log('this', place);

        const addressComponents = extractAddressComponents(
            place.address_components || []
        );

        const formData: CreateActivityFormValues = {
            placeId: place.place_id,
            name: place.name,
            formattedAddress: place.formatted_address,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            ...addressComponents
        };

        // Update form with place data
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined) {
                form.setValue(key as keyof CreateActivityFormValues, value);
            }
        });
    };

    const onSubmit = (values: z.infer<typeof CreateActivitySchema>) => {
        startTransition(async () => {
            console.log(values);
            // const data = await sendEmailChangeOTP(values);
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
            //     formVerify.setValue('newEmail', values.newEmail);
            //     setError({ error: false, message: '' });
            //     setStep('verify');
            //     setNewEmail(values.newEmail);
            //     setMaskedEmail(maskEmail(values.newEmail));
            // }
        });
    };

    const onError: SubmitErrorHandler<z.infer<typeof CreateActivitySchema>> = (
        errors
    ) => {
        setError({ error: true, message: 'error' });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle>Create Project</DialogTitle>
                </DialogHeader>
                <DialogDescription className="hidden"></DialogDescription>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, onError)}
                        className="space-y-4"
                    >
                        <div className="space-y-1">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className={cn('w-full')}>
                                        <FormLabel className="mb-6">
                                            Activity Name
                                        </FormLabel>
                                        <FormControl>
                                            <AccountFormInput
                                                {...field}
                                                type="text"
                                                placeholder="Activity name"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="formattedAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Search Places</FormLabel>
                                        <FormControl>
                                            <GooglePlacesAutocomplete
                                                onPlaceSelect={
                                                    handlePlaceSelect
                                                }
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Search for a place or enter an address..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {selectedPlace && (
                                <Card className="bg-muted/50">
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {selectedPlace.name}
                                                    </h3>
                                                    <p className="text-muted-foreground">
                                                        {
                                                            selectedPlace.formatted_address
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                Coordinates:{' '}
                                                {selectedPlace.geometry.location
                                                    .lat()
                                                    .toFixed(6)}
                                                ,{' '}
                                                {selectedPlace.geometry.location
                                                    .lng()
                                                    .toFixed(6)}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Place Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="placeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Place ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                readOnly
                                                className="bg-muted"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="latitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Latitude</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="any"
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number.parseFloat(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="longitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Longitude</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="any"
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number.parseFloat(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateActivity;
