'use client';

import { ManageGuestsProps } from '@/types/events';

const ManageGuests = ({ event, user }: ManageGuestsProps) => {
    return (
        <>
            {event.invitations.length}
            {event.invitations.map((invite) => {
                return (
                    <div key={invite.id}>
                        {invite.id}
                        {invite.recipient?.name}
                    </div>
                );
            })}
        </>
    );
};

export default ManageGuests;
