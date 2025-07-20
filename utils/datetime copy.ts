/**
 * Utility functions for handling time with DateTime fields
 */

// Convert "HH:MM AM/PM" string to DateTime (using today's date)
export function timeStringToDateTime(timeString: string): Date {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    let hours24 = hours;
    if (period === 'AM' && hours === 12) {
        hours24 = 0;
    } else if (period === 'PM' && hours !== 12) {
        hours24 = hours + 12;
    }

    const date = new Date();
    date.setHours(hours24, minutes, 0, 0);
    return date;
}

// Convert DateTime to "HH:MM AM/PM" string (ignoring date portion)
export function dateTimeToTimeString(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const period = hours >= 12 ? 'PM' : 'AM';

    return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Compare two time-only DateTimes (ignoring date portion)
export function compareTimeOnly(time1: Date, time2: Date): number {
    const minutes1 = time1.getHours() * 60 + time1.getMinutes();
    const minutes2 = time2.getHours() * 60 + time2.getMinutes();
    return minutes1 - minutes2;
}

// Check if a time falls within a schedule
export function isTimeInSchedule(
    checkTime: Date,
    scheduleStart: Date,
    scheduleEnd: Date
): boolean {
    const checkMinutes = checkTime.getHours() * 60 + checkTime.getMinutes();
    const startMinutes =
        scheduleStart.getHours() * 60 + scheduleStart.getMinutes();
    const endMinutes = scheduleEnd.getHours() * 60 + scheduleEnd.getMinutes();

    return checkMinutes >= startMinutes && checkMinutes <= endMinutes;
}

// NEW

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
