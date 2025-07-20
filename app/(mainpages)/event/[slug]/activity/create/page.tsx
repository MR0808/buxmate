import parsePhoneNumber, { PhoneNumber } from 'libphonenumber-js';
import type { Metadata } from 'next';

import { getEvent } from '@/actions/event';
import { ParamsSlug } from '@/types/global';
import { authCheck } from '@/lib/authCheck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import EventWrapper from '@/components/Event/View/EventWrapper';
import CreateActivity from '@/components/Event/Activity/Create/CreateActivity';
import EventInformation from '@/components/Event/View/EventInformation';

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
        slug: data.slug,
        host: data.host,
        state: data.state
    };

    return (
        <EventWrapper event={data} userSession={userSession}>
            <div className="space-y-5">
                <div className="grid grid-cols-12 gap-5">
                    <EventInformation event={event} />
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
