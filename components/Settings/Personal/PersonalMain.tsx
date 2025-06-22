'use client';

import { State, Country } from '@/generated/prisma';
import { useState, useEffect } from 'react';

import {
    getAllCountries,
    getCountryByName,
    getStatesByCountry,
    getStateById,
    getCountryById
} from '@/lib/location';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SessionProps } from '@/types/session';
import NameForm from '@/components/Settings/Personal/NameForm';
import GenderForm from '@/components/Settings/Personal/GenderForm';
import LocationForm from '@/components/Settings/Personal/LocationForm';
import DateOfBirthForm from '@/components/Settings/Personal/DateOfBirthForm';
import ProfilePictureForm from '@/components/Settings/Personal/ProfilePictureForm';

const PersonalMain = ({ userSession }: SessionProps) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [defaultCountry, setDefaultCountry] = useState<Country | null>(null);
    const [states, setStates] = useState<State[]>([]);
    const [country, setCountry] = useState<Country | null>(null);
    const [state, setState] = useState<State | null>(null);
    const [initialValueProp, setInitialValueProp] = useState(false);
    const user = userSession?.user;

    const hasGoogleAccount = userSession?.accounts.some(
        (account) => account.providerId === 'google'
    );

    // Do it in the page and sent a country data

    useEffect(() => {
        const fetchData = async () => {
            const countriesUE = await getAllCountries();
            setCountries(countriesUE);
            const defaultCountryUE = await getCountryByName('Australia');
            if (!defaultCountry) return null;
            const initialValuePropUE = user?.countryId ? true : false;
            const statesUE = user?.countryId
                ? await getStatesByCountry(user.countryId)
                : await getStatesByCountry(defaultCountry.id);
            const countryUE = user?.countryId
                ? await getCountryById(user.countryId)
                : await getCountryById(defaultCountry.id);
            const stateUE = user?.countryId
                ? await getStateById(user.stateId || '')
                : await getStateById(defaultCountry.id);
        };

        fetchData();
    }, [user]);

    return (
        <Card className="flex-1 transition duration-150 ease-in-out">
            <CardHeader>
                <div className="flex gap-3 items-center">
                    <div className="flex-1 text-xl text-default-700 font-bold">
                        Personal
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col w-full ">
                    {!hasGoogleAccount && (
                        <NameForm userSession={userSession} />
                    )}
                    <GenderForm
                        genderProp={userSession.user.gender || undefined}
                        userSession={userSession}
                    />
                    <LocationForm
                        countryProp={country || defaultCountry!}
                        stateProp={state || undefined}
                        countries={countries!}
                        states={states!}
                        initialValueProp={initialValueProp}
                        userSession={userSession}
                    />
                    <DateOfBirthForm
                        dateOfBirthProp={user.dateOfBirth || undefined}
                        userSession={userSession}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
export default PersonalMain;
