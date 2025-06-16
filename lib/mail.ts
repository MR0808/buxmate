'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async ({
    email,
    link
}: {
    email: string;
    link: string;
}) => {
    await resend.emails.send({
        from: process.env.NEXT_PUBLIC_APP_EMAIL as string,
        to: email,
        subject: 'Buxmate - Confirm your email',
        html: `<p>Click <a href="${link}">here</a> to confirm email.</p>`
    });
};
