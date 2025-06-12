'use client';

import { CSSProperties, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { useConfig } from '@/hooks/use-config';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMobileMenuConfig } from '@/hooks/use-mobile-menu';
import { useMenuHoverConfig } from '@/hooks/use-menu-hover';
import { LucideIcon } from '@/utils/LucideIcon';
import { SubChildren, Submenu } from '@/lib/menus';

interface MenuItemProps {
    href: string;
    label: string;
    icon: string;
    active: boolean;
    collapsed: boolean;
}

interface CollapseMenuButtonProps {
    icon: string;
    label: string;
    active: boolean;
    submenus: Submenu[];
    collapsed: boolean | undefined;
    id: string;
}

interface MultiCollapseMenuButtonProps {
    icon?: string;
    label: string;
    active: boolean;
    submenus: SubChildren[];
}

export const MenuLabel = ({
    label,
    className
}: {
    label: string;
    className?: string;
}) => {
    return (
        <p
            className={cn(
                'text-xs font-semibold text-default-800  py-4 max-w-[248px] truncate uppercase',
                className
            )}
        >
            {label}
        </p>
    );
};

export const MenuItem = ({
    href,
    label,
    icon,
    active,
    collapsed
}: MenuItemProps) => {
    const [hoverConfig] = useMenuHoverConfig();
    const { hovered } = hoverConfig;
    const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();

    return (
        <Button
            onClick={() =>
                setMobileMenuConfig({ ...mobileMenuConfig, isOpen: false })
            }
            variant={active ? 'default' : 'ghost'}
            fullWidth
            color={active ? 'default' : 'secondary'}
            className={cn('hover:ring-transparent hover:ring-offset-0', {
                'justify-start text-sm font-medium capitalize h-auto py-3 md:px-3 px-3':
                    !collapsed || hovered,
                'bg-secondary text-default hover:bg-secondary': active
            })}
            asChild
            size={collapsed && !hovered ? 'icon' : 'default'}
        >
            <Link href={href}>
                <LucideIcon
                    name={icon}
                    className={cn('h-5 w-5 ', {
                        'me-2': !collapsed || hovered
                    })}
                />
                {(!collapsed || hovered) && (
                    <p className={cn('max-w-[200px] truncate')}>{label}</p>
                )}
            </Link>
        </Button>
    );
};

export const CollapseMenuButton = ({
    icon,
    label,
    active,
    submenus,
    collapsed,
    id
}: CollapseMenuButtonProps) => {
    const pathname = usePathname();
    const isSubmenuActive = submenus.some(
        (submenu) => submenu.active || pathname.startsWith(submenu.href)
    );
    const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);
    const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();
    const [hoverConfig] = useMenuHoverConfig();
    const { hovered } = hoverConfig;
    const {
        transform,
        transition,
        setNodeRef,
        isDragging,
        attributes,
        listeners
    } = useSortable({
        id: id
    });

    useEffect(() => {
        setIsCollapsed(isSubmenuActive);
    }, [isSubmenuActive, pathname]);

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative'
    };

    return !collapsed || hovered ? (
        <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed}>
            <CollapsibleTrigger className="" asChild>
                <div className="peer flex items-center group [&[data-state=open]>button>div>div>svg]:rotate-180">
                    <Button
                        style={style}
                        ref={setNodeRef}
                        variant={active ? 'default' : 'ghost'}
                        color="secondary"
                        className={cn(
                            'justify-start capitalize group  h-auto py-3 md:px-3 px-3   ring-offset-sidebar group-data-[state=open]:bg-secondary hover:ring-transparent'
                        )}
                        fullWidth
                    >
                        <div className="w-full items-center flex justify-between">
                            <div className="flex items-center">
                                <span className="me-4">
                                    <LucideIcon
                                        name={icon}
                                        className="h-5 w-5"
                                    />
                                </span>
                                <p
                                    className={cn(
                                        'max-w-[150px] truncate',
                                        !collapsed || hovered
                                            ? 'translate-x-0 opacity-100'
                                            : '-translate-x-96 opacity-0'
                                    )}
                                >
                                    {label}
                                </p>
                            </div>
                            <div
                                className={cn(
                                    'whitespace-nowrap inline-flex items-center justify-center rounded-full h-5 w-5 bg-menu-arrow text-menu-menu-foreground  group-hover:bg-menu-arrow-active transition-all duration-300 ',
                                    !collapsed || hovered
                                        ? 'translate-x-0 opacity-100'
                                        : '-translate-x-96 opacity-0',
                                    {
                                        'bg-menu-arrow-active': active
                                    }
                                )}
                            >
                                <ChevronDown
                                    size={16}
                                    className="transition-transform duration-200"
                                />
                            </div>
                        </div>
                    </Button>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                {submenus.map(
                    ({ href, label, active, children: subChildren }, index) =>
                        subChildren?.length === 0 ? (
                            <Button
                                onClick={() =>
                                    setMobileMenuConfig({
                                        ...mobileMenuConfig,
                                        isOpen: false
                                    })
                                }
                                key={index}
                                color="secondary"
                                variant="ghost"
                                className={cn(
                                    'w-full  justify-start h-auto hover:bg-transparent hover:ring-offset-0 capitalize text-sm font-normal mb-2 last:mb-0 first:mt-3 md:px-5 px-5',
                                    {
                                        'font-medium': active,
                                        'dark:opacity-80': !active
                                    }
                                )}
                                asChild
                            >
                                <Link href={href}>
                                    <span
                                        className={cn(
                                            'h-1.5 w-1.5 me-3 rounded-full  transition-all duration-150 ring-1 ring-secondary-foreground ',
                                            {
                                                'ring-4 bg-default ring-default/30':
                                                    active
                                            }
                                        )}
                                    ></span>
                                    <p
                                        className={cn(
                                            'max-w-[170px] truncate',
                                            !collapsed || hovered
                                                ? 'translate-x-0 opacity-100'
                                                : '-translate-x-96 opacity-0'
                                        )}
                                    >
                                        {label}
                                    </p>
                                </Link>
                            </Button>
                        ) : (
                            <Fragment key={index}>
                                <MultiCollapseMenuButton
                                    label={label}
                                    active={active}
                                    submenus={subChildren as any}
                                />
                            </Fragment>
                        )
                )}
            </CollapsibleContent>
        </Collapsible>
    ) : (
        <DropdownMenu>
            <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={active ? 'default' : 'ghost'}
                                color="secondary"
                                className="w-full justify-center"
                                size="icon"
                            >
                                <LucideIcon name={icon} className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="start" alignOffset={2}>
                        {label}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent
                side="right"
                sideOffset={20}
                align="start"
                className={` border-sidebar space-y-1.5`}
            >
                <DropdownMenuLabel className="max-w-[190px] truncate">
                    {label}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-default-300" />
                <DropdownMenuGroup>
                    {submenus.map(
                        ({ href, label, icon, active, children }, index) =>
                            children?.length === 0 ? (
                                <DropdownMenuItem
                                    key={index}
                                    asChild
                                    className={cn('focus:bg-secondary', {
                                        'bg-secondary text-secondary-foreground ':
                                            active
                                    })}
                                >
                                    <Link
                                        className="cursor-pointer flex-flex gap-3"
                                        href={href}
                                    >
                                        {icon && (
                                            <LucideIcon
                                                name={icon}
                                                className=" h-4 w-4"
                                            />
                                        )}
                                        <p className="max-w-[180px] truncate">
                                            {label}{' '}
                                        </p>
                                    </Link>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuSub key={index}>
                                    <DropdownMenuSubTrigger>
                                        <span>{label}</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <ScrollArea className="h-[200px]">
                                                {children?.map(
                                                    (
                                                        { href, label, active },
                                                        index
                                                    ) => (
                                                        <DropdownMenuItem
                                                            key={`nested-index-${index}`}
                                                        >
                                                            <Link href={href}>
                                                                {label}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    )
                                                )}
                                            </ScrollArea>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            )
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const MultiCollapseMenuButton = ({
    label,
    active,
    submenus
}: MultiCollapseMenuButtonProps) => {
    const pathname = usePathname();
    const isSubmenuActive = submenus.some(
        (submenu) => submenu.active || pathname.startsWith(submenu.href)
    );
    const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);
    const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();
    return (
        <Collapsible
            open={isCollapsed}
            onOpenChange={setIsCollapsed}
            className="w-full mb-2 last:mb-0 "
        >
            <CollapsibleTrigger asChild>
                <div className=" flex items-center group [&[data-state=open]>button>div>div>svg]:rotate-180 first:mt-3 ">
                    <Button
                        color="secondary"
                        variant="ghost"
                        className="w-full justify-start h-auto hover:bg-transparent hover:ring-offset-0 capitalize text-sm font-normal   md:px-5 px-5 "
                        fullWidth
                    >
                        <div className="w-full items-center flex justify-between">
                            <div className="flex items-center">
                                <span
                                    className={cn(
                                        'h-1.5 w-1.5 me-3 rounded-full  transition-all duration-150 ring-1 ring-secondary-foreground',
                                        {
                                            'ring-4 bg-default ring-default/30':
                                                active
                                        }
                                    )}
                                ></span>
                                <p className={cn('max-w-[150px] truncate')}>
                                    {label}
                                </p>
                            </div>
                            <div
                                className={cn(
                                    'whitespace-nowrap inline-flex items-center justify-center rounded-full h-5 w-5 bg-menu-arrow text-menu-menu-foreground  group-hover:bg-menu-arrow-active transition-all duration-300 ',
                                    {
                                        'bg-menu-arrow-active': active
                                    }
                                )}
                            >
                                <ChevronDown
                                    size={16}
                                    className="transition-transform duration-200"
                                />
                            </div>
                        </div>
                    </Button>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                {submenus.map(({ href, label, active }, index) => (
                    <Button
                        key={index}
                        onClick={() =>
                            setMobileMenuConfig({
                                ...mobileMenuConfig,
                                isOpen: false
                            })
                        }
                        color="secondary"
                        variant="ghost"
                        className="w-full justify-start  h-auto mb-1.5  hover:bg-transparent first:mt-3 text-[13px]  font-normal "
                        asChild
                    >
                        <Link href={href}>
                            <span
                                className={cn(
                                    'h-1 w-1 me-3 rounded-full bg-default transition-all duration-150  ',
                                    {
                                        'ring-4 bg-secondary ring-default/30':
                                            active
                                    }
                                )}
                            ></span>
                            <p className={cn('max-w-[170px] truncate')}>
                                {label}
                            </p>
                        </Link>
                    </Button>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
};

export const SidebarHoverToggle = () => {
    const [hoverConfig, setHoverConfig] = useMenuHoverConfig();
    const [config, setConfig] = useConfig();

    return !config.collapsed || hoverConfig.hovered ? (
        <div
            onClick={() =>
                setConfig({ ...config, collapsed: !config.collapsed })
            }
            className={cn(
                'h-4 w-4 border-[1.5px] border-default-900 dark:border-default-700 rounded-full transition-all duration-150',
                {
                    [`ring-0 ring-default-900 ring-offset-4 ring-offset-secondary ring-inset bg-default-900 dark:bg-gray-600`]:
                        !config.collapsed
                }
            )}
        ></div>
    ) : null;
};
