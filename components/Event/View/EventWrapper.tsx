'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { SessionType, EventType } from '@/types/events';

const EventWrapper = ({
    children,
    event,
    userSession
}: {
    children: React.ReactNode;
    event: EventType;
    userSession: SessionType;
}) => {
    const pathname = usePathname();
    if (!event) return null;

    return (
        <div>
            <div className="flex w-full flex-wrap items-center gap-4 mb-6">
                <h4 className="flex-1 font-medium lg:text-2xl text-xl capitalize text-default-900">
                    {event.title}
                </h4>
                {!pathname.includes('/activity/create') && (
                    <div className="flex items-center gap-4 flex-wrap">
                        <Link href={`/event/${event.slug}/activity/create`}>
                            <Button className="flex-none cursor-pointer">
                                <Plus className="w-4 h-4 me-1" />
                                <span>Add Activity</span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
            {children}
        </div>
    );
};

export default EventWrapper;
