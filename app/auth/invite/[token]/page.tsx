import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { getInvitationByToken } from '@/actions/invitations';
import { ParamsToken } from '@/types/global';
import { InvitationResponseForm } from '@/components/Auth/InvitationResponseForm';
import { formatDollarsForDisplay } from '@/lib/cost';

const InvitePage = async (props: { params: ParamsToken }) => {
    const { token } = await props.params;

    if (!token) {
        return <InviteNotFound />;
    }

    const data = await getInvitationByToken(token);

    if (!data.data || !data.data.image || !data.data.image) {
        // insert code for no invitation
        return <InviteNotFound />;
    }

    const { invitation, image } = data.data;

    const isExpired = invitation.expiresAt && invitation.expiresAt < new Date();

    const totalCost = invitation.event.activities.reduce(
        (sum, item) => sum + item.cost,
        0
    );

    return (
        <>
            <div
                className="flex w-full items-center overflow-hidden min-h-dvh h-dvh basis-full bg-cover bg-no-repeat bg-center z-0"
                style={{
                    backgroundImage: `url(/images/backgrounds/auth-bg.jpg)`
                }}
            >
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="overflow-y-auto flex flex-wrap w-full h-dvh z-20">
                    <div className="lg:block hidden flex-1 overflow-hidden text-[40px] leading-[48px] text-default-600 lg:w-1/2">
                        <div className="flex justify-center items-center min-h-screen">
                            <Link href="/" className="">
                                <Image
                                    src="/images/logo/logo-white.png"
                                    alt="Buxmate"
                                    height={386}
                                    width={386}
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full flex flex-col items-center justify-center">
                        <div className="bg-default-50  relative h-auto  lg:mr-[150px] mr-auto px-5 py-10 md:px-10 md:rounded-md max-w-[520px] w-full ml-auto text-2xl text-default-900  mb-3">
                            <div className="flex justify-center items-center text-center mb-6 lg:hidden ">
                                <Link href="/">
                                    <Image
                                        src="/images/logo/logo.png"
                                        alt="Buxmate"
                                        height={64}
                                        width={120}
                                        className="text-default-900 h-16 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background"
                                    />
                                </Link>
                            </div>
                            <div className="text-center 2xl:mb-10 mb-5 items-center">
                                <h4 className="font-medium mb-2">
                                    You&apos;re Invited!
                                </h4>
                                <div className="text-default-500  text-base mb-2">
                                    {invitation.sender.name}{' '}
                                    {invitation.sender.lastName} has invited you
                                    to
                                </div>
                                <div className="bg-white shadow rounded-lg p-6 justify-items-center">
                                    {invitation.event.image && (
                                        <Image
                                            src={
                                                image.image ||
                                                '/placeholder.svg'
                                            }
                                            alt={invitation.event.title}
                                            height={64}
                                            width={120}
                                            className="h-48 object-cover rounded-lg mb-4 items-center"
                                        />
                                    )}

                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {invitation.event.title}
                                    </h3>

                                    <p className="text-gray-600 mb-4">
                                        {invitation.event.description}
                                    </p>

                                    <div className="text-sm text-gray-500 mb-6">
                                        <p>
                                            Date:{' '}
                                            {new Date(
                                                invitation.event.date
                                            ).toLocaleDateString()}
                                        </p>
                                        <p>
                                            Time:{' '}
                                            {format(
                                                toZonedTime(
                                                    invitation.event.date,
                                                    invitation.event.timezone
                                                ),
                                                'h:mm aaa'
                                            )}
                                        </p>
                                        <p>
                                            Total Cost:{' '}
                                            {formatDollarsForDisplay(totalCost)}
                                        </p>
                                    </div>

                                    {isExpired ? (
                                        <div className="text-center py-4">
                                            <p className="text-red-600 font-medium">
                                                This invitation has expired
                                            </p>
                                        </div>
                                    ) : invitation.status !== 'PENDING' ? (
                                        <div className="text-center py-4">
                                            <p className="text-gray-600">
                                                You have already{' '}
                                                {invitation.status.toLowerCase()}{' '}
                                                this invitation
                                            </p>
                                        </div>
                                    ) : (
                                        <InvitationResponseForm
                                            inviteToken={token}
                                            slug={invitation.event.slug}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 lg:block hidden text-white py-5 px-5 text-xl w-full">
                        Make your next big night{' '}
                        <span className="text-white font-bold ms-1">
                            easier
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvitePage;

const InviteNotFound = async () => {
    return (
        <>
            <div
                className="flex w-full items-center overflow-hidden min-h-dvh h-dvh basis-full bg-cover bg-no-repeat bg-center z-0"
                style={{
                    backgroundImage: `url(/images/backgrounds/auth-bg.jpg)`
                }}
            >
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="overflow-y-auto flex flex-wrap w-full h-dvh z-20">
                    <div className="lg:block hidden flex-1 overflow-hidden text-[40px] leading-[48px] text-default-600 lg:w-1/2">
                        <div className="flex justify-center items-center min-h-screen">
                            <Link href="/" className="">
                                <Image
                                    src="/images/logo/logo-white.png"
                                    alt="Buxmate"
                                    height={386}
                                    width={386}
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full flex flex-col items-center justify-center">
                        <div className="bg-default-50  relative h-auto  lg:mr-[150px] mr-auto p-10 md:rounded-md max-w-[520px] w-full ml-auto text-2xl text-default-900  mb-3">
                            <div className="flex justify-center items-center text-center mb-6 lg:hidden ">
                                <Link href="/">
                                    <Image
                                        src="/images/logo/logo.png"
                                        alt="Buxmate"
                                        height={64}
                                        width={120}
                                        className="text-default-900 h-16 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background"
                                    />
                                </Link>
                            </div>
                            <div className="text-center 2xl:mb-10 mb-5">
                                <h4 className="font-medium">Invitation</h4>
                                <div className="text-default-500  text-base">
                                    Invitation token invalid. Please try again.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 lg:block hidden text-white py-5 px-5 text-xl w-full">
                        Make your next big night{' '}
                        <span className="text-white font-bold ms-1">
                            easier
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};
