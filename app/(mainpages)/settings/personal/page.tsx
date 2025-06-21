import { authCheck } from '@/lib/authCheck';

import {
    getAllCountries,
    getCountryByName,
    getStatesByCountry,
    getStateById,
    getCountryById
} from '@/lib/location';
import SiteBreadcrumb from '@/components/Global/SiteBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NameForm from '@/components/Settings/Personal/NameForm';
import GenderForm from '@/components/Settings/Personal/GenderForm';
import LocationForm from '@/components/Settings/Personal/LocationForm';
import DateOfBirthForm from '@/components/Settings/Personal/DateOfBirthForm';
import ProfilePictureForm from '@/components/Settings/Personal/ProfilePictureForm';

const PersonalSettingsPage = async () => {
    const userSession = await authCheck();
    const { user } = userSession;

    const hasGoogleAccount = userSession.accounts.some(
        (account) => account.providerId === 'google'
    );

    const countries = await getAllCountries();
    const defaultCountry = await getCountryByName('Australia');
    if (!defaultCountry) return null;
    const initialValueProp = user?.countryId ? true : false;
    const states = user?.countryId
        ? await getStatesByCountry(user.countryId)
        : await getStatesByCountry(defaultCountry.id);
    const country = user?.countryId
        ? await getCountryById(user.countryId)
        : await getCountryById(defaultCountry.id);
    const state = user?.countryId
        ? await getStateById(user.stateId || '')
        : await getStateById(defaultCountry.id);

    return (
        <div>
            <SiteBreadcrumb />
            <div className="grid grid-cols-12 gap-5">
                <div className="lg:col-span-8 col-span-12 md:order-first order-last">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col w-full ">
                                {!hasGoogleAccount && (
                                    <NameForm userSession={userSession} />
                                )}
                                <GenderForm
                                    genderProp={
                                        userSession.user.gender || undefined
                                    }
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
                                    dateOfBirthProp={
                                        user.dateOfBirth || undefined
                                    }
                                    userSession={userSession}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-4 col-span-12 order-first md:order-last">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">
                                Profile Picture
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProfilePictureForm userSession={userSession} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PersonalSettingsPage;
