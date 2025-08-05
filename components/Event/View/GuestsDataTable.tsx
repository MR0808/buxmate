'use client';

import * as React from 'react';
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import { ChevronDown, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';

// Global filter function for searching across multiple columns
const globalFilterFn = (row: any, columnId: string, value: string) => {
    const searchableColumns = ['firstName', 'lastName', 'email'];
    const searchValue = value.toLowerCase();

    return searchableColumns.some((column) => {
        const cellValue = row.getValue(column) as string;
        return cellValue?.toLowerCase().includes(searchValue);
    });
};

interface GuestsDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    availableActivities: string[];
}

export function GuestsDataTable<TData, TValue>({
    columns,
    data,
    availableActivities
}: GuestsDataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>(
        []
    );
    const [selectedActivity, setSelectedActivity] =
        React.useState<string>('all'); // Updated default value
    const [showAllActivities, setShowAllActivities] = React.useState(false);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter
        },
        initialState: {
            pagination: {
                pageSize: 10
            }
        }
    });

    // Custom filtering logic
    React.useEffect(() => {
        const filters: ColumnFiltersState = [];

        // Status filter
        if (selectedStatuses.length > 0) {
            filters.push({
                id: 'status',
                value: selectedStatuses
            });
        }

        // Activities filter
        if (
            (selectedActivity && selectedActivity !== 'all') ||
            showAllActivities
        ) {
            filters.push({
                id: 'activities',
                value: {
                    activity: selectedActivity,
                    showAll: showAllActivities,
                    availableActivities
                }
            });
        }

        setColumnFilters(filters);
    }, [
        selectedStatuses,
        selectedActivity,
        showAllActivities,
        availableActivities
    ]);

    const statusOptions = [
        { label: 'PENDING', value: 'PENDING' },
        { label: 'ACCEPTED', value: 'ACCEPTED' },
        { label: 'DECLINED', value: 'DECLINED' },
        { label: 'EXPIRED', value: 'EXPIRED' }
    ];

    const activityOptions = availableActivities.map((activity) => ({
        label: activity,
        value: activity
    }));

    const clearAllFilters = () => {
        setSelectedStatuses([]);
        setSelectedActivity('');
        setShowAllActivities(false);
        setGlobalFilter('');
    };

    const hasActiveFilters =
        selectedStatuses.length > 0 ||
        (selectedActivity && selectedActivity !== 'all') ||
        showAllActivities ||
        globalFilter;

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={globalFilter ?? ''}
                            onChange={(event) =>
                                setGlobalFilter(String(event.target.value))
                            }
                            className="pl-8 max-w-sm"
                        />
                    </div>

                    <MultiSelect
                        options={statusOptions}
                        selected={selectedStatuses}
                        onChange={setSelectedStatuses}
                        placeholder="Filter by status"
                        className="w-[200px]"
                    />

                    <div className="flex items-center space-x-1">
                        <Select
                            value={selectedActivity}
                            onValueChange={setSelectedActivity}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by activity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Activities
                                </SelectItem>
                                {availableActivities.map((activity) => (
                                    <SelectItem key={activity} value={activity}>
                                        {activity}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedActivity && selectedActivity !== 'all' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedActivity('all')}
                                className="h-8 px-2"
                            >
                                Clear
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="all-activities"
                            checked={showAllActivities}
                            onChange={(e) =>
                                setShowAllActivities(e.target.checked)
                            }
                            className="rounded border-gray-300"
                        />
                        <label
                            htmlFor="all-activities"
                            className="text-sm font-medium"
                        >
                            Has all activities
                        </label>
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={clearAllFilters}
                            className="h-8 px-2 lg:px-3"
                        >
                            Clear filters
                        </Button>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="ml-auto bg-transparent"
                        >
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            if (value === 'all') {
                                table.setPageSize(data.length);
                            } else {
                                table.setPageSize(Number(value));
                            }
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue
                                placeholder={
                                    table.getState().pagination.pageSize
                                }
                            />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 50].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                            <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            {'<<'}
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 bg-transparent"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            {'<'}
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 bg-transparent"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            {'>'}
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            {'>>'}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredRowModel().rows.length} of{' '}
                {table.getCoreRowModel().rows.length} row(s) total.
            </div>
        </div>
    );
}
