'use client';
import { Button } from '@/components/ui/button';

export const DashboardTabs = () => {
    return (
        <div className="flex items-center space-x-4 border-b">
            <Button
                variant="ghost"
                size="sm"
                className="text-sm relative h-10 px-4 rounded-none border-b-2 border-primary"
            >
                Overview
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground relative h-10 px-4 rounded-none border-b-2 border-transparent"
            >
                Analytics
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground relative h-10 px-4 rounded-none border-b-2 border-transparent"
            >
                Reports
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground relative h-10 px-4 rounded-none border-b-2 border-transparent"
            >
                Notifications
            </Button>
        </div>
    );
};
