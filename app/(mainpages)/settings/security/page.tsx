import { authCheck } from '@/lib/authCheck';

import SiteBreadcrumb from '@/components/Global/SiteBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmailForm from '@/components/Settings/Security/EmailForm';

const PersonalSettingsPage = async () => {
    const userSession = await authCheck();
    const { user } = userSession;

    return (
        <div>
            <SiteBreadcrumb />
            <div className="grid grid-cols-12 gap-5">
                <div className="lg:col-span-8 col-span-12 md:order-first order-last">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">
                                Security Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col w-full ">
                                <EmailForm userSession={userSession} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PersonalSettingsPage;
