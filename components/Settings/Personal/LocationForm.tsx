'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTransition, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Country, State } from '@/generated/prisma';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';

import { SubmitButton } from '@/components/Form/Buttons';
import FormError from '@/components/Form/FormError';
import { LocationSchema } from '@/schemas/personal';
import { cn } from '@/lib/utils';
import { LocationProps } from '@/types/personal';
import {
    getCountryById,
    getStateById,
    getStatesByCountry
} from '@/lib/location';
import { authClient, useSession } from '@/lib/auth-client';

const LocationForm = ({
    stateProp,
    countryProp,
    countries,
    states,
    initialValueProp
}: LocationProps) => {
    const { refetch } = useSession();
    const [edit, setEdit] = useState(false);
    const [initialValue, setInitialValue] = useState(initialValueProp);
    const [error, setError] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();
    const [country, setCountry] = useState(countryProp);
    const [state, setState] = useState(stateProp);
    const [countriesList, setCountriesList] = useState<Country[]>(countries);
    const [statesList, setStatesList] = useState<State[]>(states);
    const [openCountry, setOpenCountry] = useState(false);
    const [openState, setOpenState] = useState(false);

    const errorClass = 'pl-6';

    const form = useForm<z.infer<typeof LocationSchema>>({
        resolver: zodResolver(LocationSchema),
        defaultValues: {
            state: state?.id || '',
            country: country?.id || ''
        }
    });

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const result = await getStatesByCountry(
                    form.getValues('country')
                );
                form.setValue('state', '');
                setStatesList(result!);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchStates();
    }, [form.watch('country')]);

    const cancel = () => {
        form.reset();
        setEdit(!edit);
    };

    const onSubmit = (values: z.infer<typeof LocationSchema>) => {
        startTransition(async () => {
            const stateSet = values.state ? values.state : null;
            await authClient.updateUser({
                countryId: values.country,
                stateId: stateSet,
                fetchOptions: {
                    onError: (ctx) => {
                        toast.error(ctx.error.message);
                    },
                    onSuccess: async () => {
                        const countryDb = await getCountryById(values.country);
                        const stateDb = values.state
                            ? await getStateById(values.state)
                            : undefined;
                        setCountry(countryDb!);
                        setState(stateDb!);
                        setInitialValue(true);
                        refetch();
                        setEdit(false);
                        toast.success('Location successfully updated');
                        form.reset(values);
                    }
                }
            });
        });
    };

    return (
        <div className="mt-8 border-b border-b-gray-200 pb-8">
            <div className="w-full md:w-3/5 flex flex-col gap-5">
                <div className="flex justify-between">
                    <h3 className="text-base font-semibold">Location</h3>
                    <div
                        className="cursor-pointer text-base font-normal hover:underline"
                        onClick={cancel}
                    >
                        {edit ? 'Cancel' : 'Edit'}
                    </div>
                </div>
                {edit ? (
                    <Form {...form}>
                        <FormError message={error} />
                        <form
                            className="w-full space-y-6"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <div className="flex flex-row gap-x-6">
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem className={cn('w-full')}>
                                            <Popover
                                                open={openCountry}
                                                onOpenChange={setOpenCountry}
                                            >
                                                <PopoverTrigger
                                                    asChild
                                                    className="w-full"
                                                >
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={
                                                                openCountry
                                                            }
                                                            className="h-12 w-full justify-between rounded-xl px-6 py-3 text-sm font-normal"
                                                        >
                                                            {field.value
                                                                ? countriesList.find(
                                                                      (
                                                                          country
                                                                      ) =>
                                                                          country.id ===
                                                                          field.value
                                                                  )?.name
                                                                : 'Select Country...'}
                                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command
                                                        className="w-full"
                                                        filter={(
                                                            value,
                                                            search
                                                        ) => {
                                                            const item =
                                                                countriesList.find(
                                                                    (item) =>
                                                                        item.id.toString() ===
                                                                        value
                                                                );
                                                            if (!item) return 0;
                                                            if (
                                                                item.name
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        search.toLowerCase()
                                                                    )
                                                            )
                                                                return 1;

                                                            return 0;
                                                        }}
                                                    >
                                                        <CommandInput
                                                            placeholder="Search Country..."
                                                            className="h-9 w-full"
                                                        />
                                                        <CommandList className="w-full">
                                                            <CommandEmpty className="w-full">
                                                                No country
                                                                found.
                                                            </CommandEmpty>
                                                            <CommandGroup className="w-full">
                                                                {countriesList.map(
                                                                    (
                                                                        country
                                                                    ) => (
                                                                        <CommandItem
                                                                            className="w-full"
                                                                            key={
                                                                                country.id
                                                                            }
                                                                            value={country.id.toString()}
                                                                            onSelect={() => {
                                                                                form.setValue(
                                                                                    'country',
                                                                                    country.id
                                                                                );
                                                                                setOpenCountry(
                                                                                    false
                                                                                );
                                                                            }}
                                                                        >
                                                                            {
                                                                                country.name
                                                                            }
                                                                            <CheckIcon
                                                                                className={cn(
                                                                                    'ml-auto h-4 w-4',
                                                                                    country.id ===
                                                                                        field.value
                                                                                        ? 'opacity-100'
                                                                                        : 'opacity-0'
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    )
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage
                                                className={errorClass}
                                            />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem className={cn('w-full')}>
                                            <Popover
                                                open={openState}
                                                onOpenChange={setOpenState}
                                            >
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={
                                                                openState
                                                            }
                                                            className="h-12 w-full justify-between rounded-xl px-6 py-3 text-sm font-normal"
                                                        >
                                                            {field.value &&
                                                            field.value !== ''
                                                                ? statesList.find(
                                                                      (state) =>
                                                                          state.id ===
                                                                          field.value
                                                                  )?.name
                                                                : 'Select State...'}
                                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command
                                                        filter={(
                                                            value,
                                                            search
                                                        ) => {
                                                            const item =
                                                                statesList.find(
                                                                    (item) =>
                                                                        item.id.toString() ===
                                                                        value
                                                                );
                                                            if (!item) return 0;
                                                            if (
                                                                item.name
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        search.toLowerCase()
                                                                    )
                                                            )
                                                                return 1;

                                                            return 0;
                                                        }}
                                                    >
                                                        <CommandInput
                                                            placeholder="Search State..."
                                                            className="h-9"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                No states found.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {statesList.map(
                                                                    (state) => (
                                                                        <CommandItem
                                                                            key={
                                                                                state.id
                                                                            }
                                                                            value={state.id.toString()}
                                                                            onSelect={() => {
                                                                                form.setValue(
                                                                                    'state',
                                                                                    state.id
                                                                                );
                                                                                setOpenState(
                                                                                    false
                                                                                );
                                                                            }}
                                                                        >
                                                                            {
                                                                                state.name
                                                                            }
                                                                            <CheckIcon
                                                                                className={cn(
                                                                                    'ml-auto h-4 w-4',
                                                                                    state.id ===
                                                                                        field.value
                                                                                        ? 'opacity-100'
                                                                                        : 'opacity-0'
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    )
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage
                                                className={errorClass}
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex-1">
                                <SubmitButton
                                    text="update"
                                    isPending={isPending}
                                />
                            </div>
                        </form>
                    </Form>
                ) : (
                    <div
                        className={`${!initialValue && 'italic'} text-base font-normal`}
                    >
                        {initialValue
                            ? state
                                ? `${state.name}, ${country?.name}`
                                : country?.name
                            : 'Not specified'}
                    </div>
                )}
            </div>
        </div>
    );
};
export default LocationForm;
