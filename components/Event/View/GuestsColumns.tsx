'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { User } from '@/types/events';

const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    ACCEPTED: 'bg-green-100 text-green-800 hover:bg-green-200',
    DECLINED: 'bg-red-100 text-red-800 hover:bg-red-200',
    EXPIRED: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
};

export const guestsColumns: ColumnDef<User>[] = [
    {
        accessorKey: 'firstName',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    First Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        }
    },
    {
        accessorKey: 'lastName',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Last Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        }
    },
    {
        accessorKey: 'phoneNumber',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Phone Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        }
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        }
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.getValue('status') as User['status'];
            return <Badge className={statusColors[status]}>{status}</Badge>;
        },
        filterFn: (row, id, value) => {
            const status = row.getValue(id) as string;
            return value.includes(status);
        }
    },
    {
        accessorKey: 'activities',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Activities
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const activities = row.getValue('activities') as string[];
            return (
                <div className="flex flex-wrap gap-1">
                    {activities.slice(0, 2).map((activity, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                        >
                            {activity}
                        </Badge>
                    ))}
                    {activities.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                            +{activities.length - 2} more
                        </Badge>
                    )}
                </div>
            );
        },
        sortingFn: (rowA, rowB) => {
            const activitiesA = rowA.getValue('activities') as string[];
            const activitiesB = rowB.getValue('activities') as string[];
            return activitiesA.length - activitiesB.length;
        },
        filterFn: (row, id, value) => {
            const userActivities = row.getValue(id) as string[];
            const { activity, showAll, availableActivities } = value;

            // If "show all activities" is checked, only show users who have ALL available activities
            if (showAll) {
                return availableActivities.every((act: string) =>
                    userActivities.includes(act)
                );
            }

            // If a specific activity is selected (and it's not "all"), show users who have that activity
            if (activity && activity !== 'all') {
                return userActivities.includes(activity);
            }

            // If activity is "all" or not set, show all users (no filtering)
            return true;
        }
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(user.id)
                            }
                        >
                            Copy user ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View user</DropdownMenuItem>
                        <DropdownMenuItem>Edit user</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            Delete user
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
