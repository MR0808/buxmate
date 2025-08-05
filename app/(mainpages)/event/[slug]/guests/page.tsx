import type { Metadata } from 'next';

import { getEvent } from '@/actions/event';
import { ParamsSlug } from '@/types/global';
import { authCheck } from '@/lib/authCheck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import EventWrapper from '@/components/Event/View/EventWrapper';
import CreateActivity from '@/components/Event/Activity/Create/CreateActivity';
import EventInformation from '@/components/Event/View/EventInformation';
import ManageGuests from '@/components/Event/View/ManageGuests';

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
    const title = `Manage Guests | ${event.title}`;
    const description = 'Manage Guests';

    return {
        title,
        description
    };
}

const ManageGuestsPage = async (props: { params: ParamsSlug }) => {
    const { slug } = await props.params;
    const userSession = await authCheck(`/event/${slug}/guests`);
    const { data } = await getEvent(slug);

    if (!data) return <Alert color="destructive"> Event id is not valid</Alert>;

    const event = {
        id: data.id,
        timezone: data.timezone,
        date: data.date,
        slug: data.slug,
        host: data.host,
        state: data.state,
        totalCost: 0,
        invitations: data.invitations
    };

    return (
        <EventWrapper event={data} userSession={userSession}>
            <div className="space-y-5">
                <div className="grid grid-cols-12 gap-5">
                    {/* <EventInformation event={event} user={userSession.user} /> */}
                    <Card className="col-span-12">
                        <CardHeader>
                            <CardTitle>Manage Guests</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {userSession.user.id === data.hostId ? (
                                <ManageGuests
                                    user={userSession.user}
                                    event={event}
                                />
                            ) : (
                                'You do not have access to this page. Please go back to the event.'
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </EventWrapper>
    );
};
export default ManageGuestsPage;
