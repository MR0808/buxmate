import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import parsePhoneNumber, { PhoneNumber } from 'libphonenumber-js';

import { getEvent } from '@/actions/event';
import { ParamsSlug } from '@/types/global';
import { authCheck } from '@/lib/authCheck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart,
    Calculator,
    ChartPie,
    Clock,
    Link2,
    Video,
    Phone,
    Mail,
    Map,
    CalendarClock,
    CircleUserRound
} from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import EventWrapper from '@/components/Event/View/EventWrapper';
import EventActivities from '@/components/Event/View/EventActivities';

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { data: event } = await getEvent(slug);
    if (!event) {
        return null;
    }
    const title = `View Event | ${event.title}`;
    const description = 'View your event details';

    return {
        title,
        description
    };
}

const EventDetailsPage = async (props: { params: ParamsSlug }) => {
    const userSession = await authCheck();
    const { slug } = await props.params;
    const { data } = await getEvent(slug);

    if (!data) return <Alert color="destructive"> Event id is not valid</Alert>;

    let phoneNumber: PhoneNumber | undefined;

    if (data.host.phoneNumber) {
        phoneNumber = parsePhoneNumber(data.host.phoneNumber);
    }

    const activities = data.activities.map((activity) => {
        return { activityName: activity.name, activityCost: activity.cost };
    });

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

                    <Card className="col-span-12 xl:col-span-5">
                        <CardHeader>
                            <CardTitle>About Project</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="text-base font-medium text-default-800  mb-3">
                                Background information
                            </div>
                            <p className="text-sm text-default-600">
                                The Optimistic Website Company - Amet minim
                                mollit non deserunt ullamco est sit aliqua dolor
                                do amet sint. Velit officia consequat duis enim
                                velit mollit. Exercita -tion veniam consequat
                                sunt nostrud amet.
                            </p>
                            <br />
                            <p className="text-sm text-default-600">
                                Amet minim mollit non deserunt ullamco est sit
                                aliqua dolor do amet sint.The Optimistic Website
                                Company - Amet minim mollit non deserunt ullamco
                                est sit aliqua dolor do amet sint. Velit officia
                                consequat duis enim velit mollit. Exercita -tion
                                veniam consequat sunt nostrud amet.
                            </p>
                            <p className="text-sm text-default-600 mt-4">
                                Amet minim mollit non deserunt ullamco est sit
                                aliqua dolor do amet sint.The Optimistic Website
                                Company. Amet minim mollit non deserunt ullamco
                                est sit aliqua dolor do amet sint.The Optimistic
                                Website Company. <br /> <br />
                                Amet minim mollit non deserunt ullamco est sit
                                aliqua dolor do amet sint.The Optimistic Website
                                Company.
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
                            <CardTitle>Activities</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <EventActivities activities={activities} />
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
