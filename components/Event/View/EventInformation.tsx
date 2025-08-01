import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import parsePhoneNumber, { PhoneNumber } from 'libphonenumber-js';
import {
    Phone,
    Mail,
    Map,
    CalendarClock,
    CircleUserRound,
    DollarSign,
    UsersRound
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventInformationProps } from '@/types/events';
import { formatDollarsForDisplay } from '@/lib/cost';
import Link from 'next/link';

const EventInformation = ({ event, user }: EventInformationProps) => {
    let phoneNumber: PhoneNumber | undefined;

    if (event.host.phoneNumber) {
        phoneNumber = parsePhoneNumber(event.host.phoneNumber);
    }

    const totalGuests = event.invitations.length;
    const statusCounts = event.invitations.reduce(
        (acc, { status }) => {
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        },
        { PENDING: 0, ACCEPTED: 0, DECLINED: 0, EXPIRED: 0 }
    );

    return (
        <Card className="lg:col-span-3 col-span-12">
            <CardHeader className="border-b">
                <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
                    Info
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <ul className="list space-y-8">
                    <li className="flex space-x-3 rtl:space-x-reverse">
                        <div className="flex-none text-2xl text-default-600 ">
                            <CalendarClock />
                        </div>
                        <div className="flex-1">
                            <div className="uppercase text-xs text-default-500  mb-1 leading-[12px]">
                                Date
                            </div>
                            <div>
                                {format(
                                    toZonedTime(event.date, event.timezone),
                                    'h:mm aaa'
                                )}
                            </div>
                            <div>
                                {format(
                                    toZonedTime(event.date, event.timezone),
                                    'do MMMM, yyyy'
                                )}
                            </div>
                        </div>
                    </li>

                    <li className="flex space-x-3 rtl:space-x-reverse">
                        <div className="flex-none text-2xl text-default-600 ">
                            <DollarSign />
                        </div>
                        <div className="flex-1">
                            <div className="uppercase text-xs text-default-500  mb-1 leading-[12px]">
                                Total Cost
                            </div>
                            <div>
                                {formatDollarsForDisplay(event.totalCost)}
                            </div>
                        </div>
                    </li>

                    <li className="flex space-x-3 rtl:space-x-reverse">
                        <div className="flex-none text-2xl text-default-600 ">
                            <CircleUserRound />
                        </div>
                        <div className="flex-1">
                            <div className="uppercase text-xs text-default-500  mb-1 leading-[12px]">
                                Host
                            </div>
                            {`${event.host.name} ${event.host.lastName}`}
                        </div>
                    </li>

                    <li className="flex space-x-3 rtl:space-x-reverse">
                        <div className="flex-none text-2xl text-default-600 ">
                            <Mail />
                        </div>
                        <div className="flex-1">
                            <div className="uppercase text-xs text-default-500  mb-1 leading-[12px]">
                                EMAIL
                            </div>
                            <a
                                href={`mailto:${event.host.email}`}
                                className="text-base text-default-600 "
                            >
                                {event.host.email}
                            </a>
                        </div>
                    </li>

                    <li className="flex space-x-3 rtl:space-x-reverse">
                        <div className="flex-none text-2xl text-default-600 ">
                            <Phone />
                        </div>
                        <div className="flex-1">
                            <div className="uppercase text-xs text-default-500  mb-1 leading-[12px]">
                                PHONE
                            </div>
                            <a
                                href="tel:0189749676767"
                                className="text-base text-default-600 "
                            >
                                {phoneNumber
                                    ? phoneNumber.formatNational()
                                    : ''}
                            </a>
                        </div>
                    </li>

                    <li className="flex space-x-3 rtl:space-x-reverse">
                        <div className="flex-none text-2xl text-default-600">
                            <Map />
                        </div>
                        <div className="flex-1">
                            <div className="uppercase text-xs text-default-500 mb-1 leading-[12px]">
                                LOCATION
                            </div>
                            <div className="text-base text-default-600 ">
                                {`${event.state.name}, ${event.state.country.name}`}
                            </div>
                        </div>
                    </li>

                    <li className="flex space-x-3 rtl:space-x-reverse">
                        <div className="flex-none text-2xl text-default-600">
                            <UsersRound />
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-row justify-between">
                                <div className="uppercase text-xs text-default-500 mb-1 leading-[12px]">
                                    ATTENDEES
                                </div>
                                {user.id === event.host.id ? (
                                    <Link
                                        href={`/event/${event.slug}/guests`}
                                        className="text-xs text-default hover:underline cursor-pointer hover:text-default-500 mb-1 leading-[12px]"
                                    >
                                        Manage
                                    </Link>
                                ) : (
                                    <div className="text-xs text-default hover:underline cursor-pointer hover:text-default-500 mb-1 leading-[12px]">
                                        View Guests
                                    </div>
                                )}
                            </div>
                            <div className="text-base text-default-600 ">
                                <div className="flex flex-col">
                                    <div className="mb-2">
                                        Total Guests - {totalGuests}
                                    </div>
                                    <div>
                                        Accepted - {statusCounts.ACCEPTED}
                                    </div>
                                    <div>Pending - {statusCounts.PENDING}</div>
                                    <div>
                                        Declined - {statusCounts.DECLINED}
                                    </div>
                                    <div>Expired - {statusCounts.EXPIRED}</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </CardContent>
        </Card>
    );
};
export default EventInformation;
