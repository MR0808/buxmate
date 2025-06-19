import { Dispatch, SetStateAction } from 'react';

export type EmailDialogProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    initialEmail?: string;
};
