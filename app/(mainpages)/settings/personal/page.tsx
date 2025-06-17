import { authCheck } from '@/lib/authCheck';

import SiteBreadcrumb from '@/components/Global/SiteBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PersonalSettingsPage = async () => {
    const { user, session } = await authCheck();

    return (
        <div>
            <SiteBreadcrumb />
            <div className="grid grid-cols-12 gap-5">
                <div className="lg:col-span-8 col-span-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex w-80 flex-col sm:w-3/5">
                                {!user?.isOAuth && (
                                    <NameForm session={session} />
                                )}
                                {/* <GenderForm
                                    genderProp={userDb?.gender || undefined}
                                />
                                <LocationForm
                                    countryProp={country || defaultCountry!}
                                    stateProp={state || undefined}
                                    countries={countries!}
                                    states={states!}
                                    initialValueProp={initialValueProp}
                                />
                                <DateOfBirthForm
                                    dateOfBirthProp={
                                        userDb?.dateOfBirth || undefined
                                    }
                                /> */}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-4 col-span-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">
                                Profile Picture
                            </CardTitle>
                        </CardHeader>
                        <CardContent>Pic goes here</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
export default PersonalSettingsPage;
