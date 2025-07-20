import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import parsePhoneNumber, { PhoneNumber } from 'libphonenumber-js';
import type { Metadata } from 'next';

import { getEvent } from '@/actions/event';
import { ParamsSlug } from '@/types/global';
import { authCheck } from '@/lib/authCheck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Map, CalendarClock, CircleUserRound } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import EventWrapper from '@/components/Event/View/EventWrapper';
import CreateActivity from '@/components/Event/Activity/Create/CreateActivity';

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const { data: event } = await getEvent(slug);
    if (!event) {
        return { title: 'Event not found' };
    }
    const title = `Create Activity | ${event.title}`;
    const description = 'Create an activity';

    return {
        title,
        description
    };
}

const EventDetailsPage = async (props: { params: ParamsSlug }) => {
    const { slug } = await props.params;
    const userSession = await authCheck(`/event/${slug}/activity/create`);
    const { data } = await getEvent(slug);

    if (!data) return <Alert color="destructive"> Event id is not valid</Alert>;

    let phoneNumber: PhoneNumber | undefined;

    if (data.host.phoneNumber) {
        phoneNumber = parsePhoneNumber(data.host.phoneNumber);
    }

    const event = {
        id: data.id,
        timezone: data.timezone,
        date: data.date,
        slug: data.slug
    };

    return (
        <EventWrapper event={data} userSession={userSession}>
            <div className="space-y-5">
                <div className="grid grid-cols-12 gap-5">
                    <Card className="lg:col-span-3 col-span-12">
                        <CardHeader className="border-b">
                            <CardTitle className="text-xl font-normal">
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
                                        {`${data.activities[0] ? data.activities[0].startTime + ' ' : ''}${format(
                                            toZonedTime(
                                                data.date,
                                                data.timezone
                                            ),
                                            'do MMMM, yyyy'
                                        )}`}
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
                                        {`${data.host.name} ${data.host.lastName}`}
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
                                            href={`mailto:${data.host.email}`}
                                            className="text-base text-default-600 "
                                        >
                                            {data.host.email}
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
                                            {`${data.state.name}, ${data.state.country.name}`}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="col-span-12 xl:col-span-9">
                        <CardHeader>
                            <CardTitle>Create Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <CreateActivity
                                userSession={userSession}
                                event={event}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </EventWrapper>
    );
};
export default EventDetailsPage;
