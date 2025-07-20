// Generate hour options (01-12)
export const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = (i + 1).toString().padStart(2, '0');
    return { value: hour, label: hour };
});

// Generate minute options in 5-minute increments
export const minuteOptions = Array.from({ length: 12 }, (_, i) => {
    const minute = (i * 5).toString().padStart(2, '0');
    return { value: minute, label: minute };
});

// AM/PM options
export const periodOptions = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' }
];

// Helper function to convert 12-hour time to 24-hour format
export const convertTo24Hour = (
    hour: string,
    minute: string,
    period: string
): { hour: number; minute: number } => {
    let hour24 = Number.parseInt(hour);

    if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
    } else if (period === 'PM' && hour24 !== 12) {
        hour24 += 12;
    }

    return { hour: hour24, minute: Number.parseInt(minute) };
};

// Helper function to combine date and time into DateTime
export const combineDateTime = (
    date: Date,
    hour: string,
    minute: string,
    period: string
): Date => {
    const { hour: hour24, minute: min } = convertTo24Hour(hour, minute, period);
    const combined = new Date(date);
    combined.setHours(hour24, min, 0, 0);
    return combined;
};

// Helper function to format time in 12-hour format
export const formatTime12Hour = (
    hour: string,
    minute: string,
    period: string
): string => {
    return `${hour}:${minute} ${period}`;
};
