import { headers } from 'next/headers';

export const calculateCooldownSeconds = (resetTime: Date): number => {
    return Math.max(0, Math.ceil((resetTime.getTime() - Date.now()) / 1000));
};

export const getClientIP = (request: Request): string => {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return 'unknown';
};

export const getClientInfo = async () => {
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const realIP = headersList.get('x-real-ip');
    const userAgent = headersList.get('user-agent') || 'unknown';

    let ipAddress = 'unknown';
    if (forwarded) {
        ipAddress = forwarded.split(',')[0].trim();
    } else if (realIP) {
        ipAddress = realIP;
    }

    return { ipAddress, userAgent };
};
