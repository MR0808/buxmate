import { type NextRequest, NextResponse } from 'next/server';
import { cleanupOrphanedImages } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        // Verify the request is from Vercel Cron
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Run cleanup with 7-day safety buffer
        const result = await cleanupOrphanedImages({
            olderThanDays: 7
        });

        return NextResponse.json({
            message: 'Image cleanup completed',
            ...result
        });
    } catch (error) {
        console.error('Image cleanup job failed:', error);
        return NextResponse.json(
            {
                error: 'Image cleanup job failed',
                details:
                    error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
