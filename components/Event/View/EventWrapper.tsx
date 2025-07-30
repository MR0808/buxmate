'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { SessionType, EventType } from '@/types/events';
import AddGuests from '@/components/Event/View/AddGuests';

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
    const [open, setOpen] = useState<boolean>(false);
    if (!event) return null;

    return (
        <div>
            <div className="flex w-full flex-wrap items-center gap-4 mb-6">
                <Link
                    href={`/event/${event.slug}`}
                    className="cursor-pointer flex-1"
                >
                    <h4 className="font-medium lg:text-2xl text-xl capitalize text-default-900">
                        {event.title}
                    </h4>
                </Link>
                {!pathname.includes('/activity/create') && (
                    <>
                        <AddGuests
                            open={open}
                            setOpen={setOpen}
                            eventSlug={event.slug}
                        />
                        <div className="flex items-center gap-4 flex-wrap">
                            <Link href={`/event/${event.slug}/activity/create`}>
                                <Button className="flex-none cursor-pointer">
                                    <Plus className="w-4 h-4 me-1" />
                                    <span>Add Activity</span>
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            <Button
                                className="flex-none cursor-pointer"
                                onClick={() => setOpen(true)}
                            >
                                <Plus className="w-4 h-4 me-1" />
                                <span>Add Guests</span>
                            </Button>
                        </div>
                    </>
                )}
            </div>
            {children}
        </div>
    );
};

export default EventWrapper;
