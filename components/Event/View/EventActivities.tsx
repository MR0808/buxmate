const EventActivities = ({
    activities
}: {
    activities: {
        activityName: string;
        activityCost: number;
    }[];
}) => {
    return activities.map((activity, index) => (
        <div key={index} className="mb-5">
            {activity.activityName} - {activity.activityCost}
        </div>
    ));
};
export default EventActivities;
