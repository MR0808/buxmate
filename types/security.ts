import { Dispatch, SetStateAction } from 'react';

import { auth } from '@/lib/auth';

export type Session = typeof auth.$Infer.Session;
export type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;

export type EmailDialogProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    initialEmail?: string;
    refetch: () => void;
    userSession: SessionType | null;
};
