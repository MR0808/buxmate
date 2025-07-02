'use client';

import { Filter, List, Plus } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { getEvent } from '@/actions/event';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CreateActivity from '@/components/Event/Activity/Create/CreateActivity';
import { auth } from '@/lib/auth';

export type Session = typeof auth.$Infer.Session;
export type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;

type EventType = Awaited<ReturnType<typeof getEvent>>['data'];

const EventWrapper = ({
    children,
    event,
    userSession
}: {
    children: React.ReactNode;
    event: EventType;
    userSession: SessionType;
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const pathname = usePathname();

    if (!event) return null;

    return (
        <div>
            <CreateActivity
                open={open}
                setOpen={setOpen}
                eventId={event.id}
                userSession={userSession}
            />
            <div className="flex w-full flex-wrap items-center gap-4 mb-6">
                <h4 className="flex-1 font-medium lg:text-2xl text-xl capitalize text-default-900">
                    {event?.title}
                </h4>
                <div className="flex items-center gap-4 flex-wrap">
                    <Button className="flex-none" onClick={() => setOpen(true)}>
                        <Plus className="w-4 h-4 me-1" />
                        <span>Add Activity</span>
                    </Button>
                </div>
            </div>
            {children}
        </div>
    );
};

export default EventWrapper;
