'use client';

import { ManageGuestsProps } from '@/types/events';
import { GuestsDataTable } from '@/components/Event/View/GuestsDataTable';
import { guestsColumns } from '@/components/Event/View/GuestsColumns';
import { mockUsers, availableActivities } from '@/types/events';

const ManageGuests = ({ event, user }: ManageGuestsProps) => {
    const invitations = event.invitations.map((invite) => {
        return {
            id: invite.id,
            firstName: invite.recipient?.name || '',
            lastName: invite.recipient?.lastName || '',
            phoneNumber: invite.recipient?.phoneNumber || invite.phoneNumber,
            email: invite.recipient?.email || '',
            status: invite.status,
            activities: []
        };
    });

    return (
        <>
            <GuestsDataTable
                columns={guestsColumns}
                data={invitations}
                availableActivities={availableActivities}
            />
        </>
    );
};

export default ManageGuests;
