import Link from 'next/link';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from '@/components/ui/card';
import SiteBreadcrumb from '@/components/Global/SiteBreadcrumb';
import { ArrowRight, Lock, Settings2, User } from 'lucide-react';
import { authCheck } from '@/lib/authCheck';

const settings = async () => {
    const userSession = await authCheck();

    const hasGoogleAccount = userSession.accounts.some(
        (account) => account.providerId === 'google'
    );

    return (
        <div>
            <SiteBreadcrumb />
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex gap-3 items-center">
                            <div className="flex-none h-8 w-8 rounded-full bg-default-800  text-default-300 flex flex-col items-center justify-center text-lg">
                                <User />
                            </div>
                            <div className="flex-1 text-base text-default-900  font-medium">
                                Personal Details
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-default-600  text-sm">
                            Set up your personal details, update your profile
                            picture and more
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link
                            href="/settings/personal"
                            className="inline-flex items-center gap-3 text-sm capitalize font-medium text-default-600 "
                        >
                            <span>Change Settings</span> <ArrowRight />
                        </Link>
                    </CardFooter>
                </Card>
                {!hasGoogleAccount && (
                    <Card>
                        <CardHeader>
                            <div className="flex gap-3 items-center">
                                <div className="flex-none h-8 w-8 rounded-full bg-primary-500 text-default-300 flex flex-col items-center justify-center text-lg">
                                    <Lock />
                                </div>
                                <div className="flex-1 text-base text-default-900  font-medium">
                                    Security Settings
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-default-600  text-sm">
                                Update your email, password and add two factor
                                authentication
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link
                                href="/settings/security"
                                className="inline-flex items-center gap-3 text-sm capitalize font-medium text-default-600 "
                            >
                                <span>Change Settings</span> <ArrowRight />
                            </Link>
                        </CardFooter>
                    </Card>
                )}
                <Card>
                    <CardHeader>
                        <div className="flex gap-3 items-center">
                            <div className="flex-none h-8 w-8 rounded-full bg-success text-white flex flex-col items-center justify-center text-lg">
                                <Settings2 />
                            </div>
                            <div className="flex-1 text-base text-default-900  font-medium">
                                General Settings
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-default-600  text-sm">
                            Update other settings, including notifications and
                            other information
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-3 text-sm capitalize font-medium text-default-600 "
                        >
                            <span>Change Settings</span> <ArrowRight />
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default settings;
