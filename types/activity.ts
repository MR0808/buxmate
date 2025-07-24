import { auth } from '@/lib/auth';

export type Session = typeof auth.$Infer.Session;
export type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;

interface EventType {
    id: string;
    timezone: string;
    date: Date;
    slug: string;
}

export interface CreateActivityProps {
    event: EventType;
    userSession: SessionType | null;
}

export interface Activity {
    activityName: string;
    activityCost: number;
    startTime: Date;
    endTime: Date;
    location: string;
}
