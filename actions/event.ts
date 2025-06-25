'use server';

import * as z from 'zod';

import { prisma } from '@/lib/prisma';
import { authCheckServer } from '@/lib/authCheck';
import { ActionResult } from '@/types/global';

export const getImageUrl = async (id: string): Promise<ActionResult> => {
    const userSession = await authCheckServer();

    if (!userSession) {
        return {
            success: false,
            message: 'Not authorised'
        };
    }

    try {
        const image = await prisma.image.findUnique({ where: { id } });

        if (!image) {
            return {
                success: false,
                message: `Error - Image not found`
            };
        }

        return {
            success: true,
            message: image.image
        };
    } catch (error) {
        return {
            success: false,
            message: `Error - ${error}`
        };
    }
};
