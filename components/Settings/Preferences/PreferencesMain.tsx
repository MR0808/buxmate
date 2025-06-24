'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SettingsProps } from '@/types/settings';
import NameForm from '@/components/Settings/Personal/NameForm';
import GenderForm from '@/components/Settings/Personal/GenderForm';
import LocationForm from '@/components/Settings/Personal/LocationForm';
import DateOfBirthForm from '@/components/Settings/Personal/DateOfBirthForm';
import ProfilePictureForm from '@/components/Settings/Personal/ProfilePictureForm';

const PersonalMain = ({ userSession, location }: SettingsProps) => {
    if (!userSession) return null;
    const user = userSession.user;

    const hasGoogleAccount = userSession.accounts.some(
        (account) => account.providerId === 'google'
    );

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
                    <ProfilePictureForm userSession={userSession} />
                    {!hasGoogleAccount && (
                        <NameForm userSession={userSession} />
                    )}
                    <GenderForm
                        genderProp={user.gender || undefined}
                        userSession={userSession}
                    />
                    <LocationForm
                        countryProp={
                            location.country || location.defaultCountry!
                        }
                        stateProp={location.state || undefined}
                        countries={location.countries!}
                        states={location.states!}
                        initialValueProp={location.initialValueProp}
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
