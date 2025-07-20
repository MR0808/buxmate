import { CircleDot, CircleDotDashed } from 'lucide-react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { formatDollarsForDisplay } from '@/lib/cost';

const EventActivities = ({
    timezone,
    activities
}: {
    timezone: string;
    activities: {
        activityName: string;
        activityCost: number;
        startTime: Date;
        endTime: Date;
        location: string;
    }[];
}) => {
    return (
        <ul className="relative before:absolute before:start-6 before:top-3.5 before:w-[1px] before:h-[80%] before:bg-default-200">
            {activities.map((activity, index) => (
                <li className="flex gap-3 px-4 pb-10" key={index}>
                    <div className="w-5 h-5 rounded-full flex justify-center items-center bg-default-600 relative text-default-foreground text-sm">
                        {/* <CircleDotDashed className="w-3 h-3 text-default-foreground" /> */}
                        {index + 1}
                    </div>
                    <div>
                        <h2 className="text-sm font-medium  mb-1 text-default-600">
                            {activity.activityName}
                        </h2>
                        <p className="text-xs">
                            {`${format(
                                toZonedTime(activity.startTime, timezone),
                                'h:mm aaa'
                            )} - ${format(
                                toZonedTime(activity.endTime, timezone),
                                'h:mm aaa'
                            )}`}
                        </p>
                        <p className="text-xs capitalize">
                            {activity.location}
                        </p>
                        <p className="text-xs capitalize">
                            {formatDollarsForDisplay(activity.activityCost)}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
};
export default EventActivities;
