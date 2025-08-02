import Image from 'next/image';
import Link from 'next/link';
import { Link2 } from 'lucide-react';
import type { Metadata } from 'next';

import { getEvent } from '@/actions/event';
import { ParamsSlug } from '@/types/global';
import { authCheck } from '@/lib/authCheck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Alert } from '@/components/ui/alert';
import EventWrapper from '@/components/Event/View/EventWrapper';
import EventActivities from '@/components/Event/View/EventActivities';
import EventInformation from '@/components/Event/View/EventInformation';
import { Activity } from '@/types/activity';

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
    const title = `View Event | ${event.title}`;
    const description = 'View your event details';

    return {
        title,
        description
    };
}

const EventDetailsPage = async (props: { params: ParamsSlug }) => {
    const { slug } = await props.params;
    const userSession = await authCheck(`/event/${slug}`);
    const { data } = await getEvent(slug);

    if (!data) return <Alert color="destructive"> Event id is not valid</Alert>;

    const activities: Activity[] = data.activities.map((activity) => {
        return {
            activityName: activity.name,
            activityCost: activity.cost,
            startTime: activity.startTime,
            endTime: activity.endTime,
            location: activity.place?.name || ''
        };
    });

    const getTotalCost = (activitiesArray: Activity[]): number => {
        return activitiesArray.reduce(
            (total, activity) => total + activity.activityCost, // Note: Use activityCost to match the property name
            0
        );
    };

    const totalCost = activities.length > 0 ? getTotalCost(activities) : 0;

    const event = {
        host: data.host,
        timezone: data.timezone,
        id: data.id,
        date: data.date,
        state: data.state,
        totalCost,
        invitations: data.invitations,
        slug: data.slug
    };

    return (
        <EventWrapper event={data} userSession={userSession}>
            <div className="space-y-5">
                <div className="grid grid-cols-12 gap-5">
                    <EventInformation event={event} user={userSession.user} />
                    <Card className="col-span-12 xl:col-span-5">
                        <CardHeader>
                            <CardTitle>
                                <Image
                                    src={
                                        data.image?.image ||
                                        '/images/logo/logo.png'
                                    }
                                    alt={data.title}
                                    width={300}
                                    height={100}
                                    className="rounded-4xl"
                                />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {/* <div className="text-base font-medium text-default-800  mb-3">
                                Background information
                            </div> */}
                            <p className="text-sm text-default-600">
                                {data.description}
                            </p>

                            <div className="flex flex-wrap mt-8">
                                <div className="xl:mr-8 mr-4 mb-3 space-y-1">
                                    <div className="font-semibold text-default-500 ">
                                        Existing website
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-normal text-primary">
                                        <Link2 />
                                        <Link href="#">www.example.com</Link>
                                    </div>
                                </div>
                                <div className="xl:me-8 me-4 mb-3 space-y-1">
                                    <div className="font-semibold text-default-500">
                                        Project brief
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-normal text-primary-600 ">
                                        <Link2 />
                                        <Link href="#">www.example.com</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-default-100  rounded px-4 pt-4 pb-1 flex flex-wrap justify-between mt-6">
                                <div className="me-3 mb-3 space-y-2">
                                    <div className="text-xs font-medium text-default-600">
                                        Project owner
                                    </div>
                                    <div className="text-xs text-default-600">
                                        John Doe
                                    </div>
                                </div>
                                <div className="me-3 mb-3 space-y-2">
                                    <div className="text-xs font-medium text-default-600">
                                        Budget
                                    </div>
                                    <div className="text-xs text-default-600 ">
                                        $75,800
                                    </div>
                                </div>
                                <div className="me-3 mb-3 space-y-2">
                                    <div className="text-xs font-medium text-default-600">
                                        Start date
                                    </div>
                                    <div className="text-xs text-default-600">
                                        01/11/2021
                                    </div>
                                </div>
                                <div className="me-3 mb-3 space-y-2">
                                    <div className="text-xs font-medium text-default-600 ">
                                        Deadline
                                    </div>
                                    <div className="text-xs text-warning">
                                        01/11/2021
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-12 xl:col-span-4">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
                                Activities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <EventActivities
                                activities={activities}
                                timezone={event.timezone}
                            />
                        </CardContent>
                    </Card>

                    {/* <Card className="col-span-12 xl:col-span-4">
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                        <NotesCalendar />
                        <ul className="divide-y divide-default-100">
                            {meets.map((item, i) => (
                                <li key={i} className=" py-2.5 px-3">
                                    <div className="flex gap-2">
                                        <div className="flex-1 flex gap-2.5">
                                            <div className="flex-none">
                                                <div className="h-8 w-8">
                                                    <Image
                                                        src={item.img}
                                                        alt=""
                                                        className="w-full h-full "
                                                        width={32}
                                                        height={32}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-default-600 text-sm  mb-1 font-medium">
                                                    {item.title}
                                                </div>
                                                <div className="flex gap-1 font-normal text-xs  text-default-500">
                                                    <div className="text-base">
                                                        <Video />
                                                    </div>
                                                    {item.meet}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-none text-xs text-default-600">
                                            {item.date}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card> */}
                </div>
                {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Card>
                    <CardHeader className="flex-row  items-center justify-between">
                        <CardTitle>Task List</CardTitle>
                        <DashboardDropdown />
                    </CardHeader>
                    <CardContent className="p-0">
                        <ul className="divide-y divide-default-100">
                            {tasks.map((task, index) => (
                                <TaskItem key={index} task={task} />
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Messages</CardTitle>
                        <DashboardDropdown />
                    </CardHeader>
                    <CardContent className="p-0">
                        <ul className="divide-y divide-default-100">
                            {messagesData.map((message, index) => (
                                <MessageListItem
                                    message={message}
                                    key={index}
                                />
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Activity</CardTitle>
                        <DashboardDropdown />
                    </CardHeader>
                    <CardContent className="p-0">
                        <ul className="relative before:absolute before:start-6 before:top-3.5 before:w-[1px] before:h-[80%] before:bg-default-200">
                            {activityList.map((activity, index) => (
                                <ActivityItem activity={activity} key={index} />
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-8">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Team Members</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <TeamTable data={teamData} />
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Files</CardTitle>
                            <DashboardDropdown />
                        </CardHeader>
                        <CardContent>
                            <ul className="divide-y divide-default-100">
                                {files.map((item, i) => (
                                    <li key={i} className="py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 flex gap-2">
                                                <div className="flex-none">
                                                    <div className="h-8 w-8">
                                                        <Image
                                                            src={item.img}
                                                            alt=""
                                                            width={32}
                                                            height={32}
                                                            className=" w-full h-full object-cover rounded-full border hover:border-white border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-default-600 text-sm">
                                                        {item.title}
                                                    </div>
                                                    <div className="font-normal text-xs text-default-500 mt-1">
                                                        {item.date}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-none">
                                                <button
                                                    type="button"
                                                    className="text-xs text-slate-900 dark:text-white"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div> */}
            </div>
        </EventWrapper>
    );
};
export default EventDetailsPage;
