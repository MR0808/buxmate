'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, Fragment } from 'react';

import { useConfig } from '@/hooks/use-config';
import { getHorizontalMenuList } from '@/lib/menus';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger
} from '@/components/ui/menubar';
import { useMediaQuery } from '@/hooks/use-media-query';
import { LucideIcon } from '@/utils/LucideIcon';
import { cn } from '@/lib/utils';

const NavMenu = () => {
    const [config] = useConfig();

    const pathname = usePathname();

    const menuList = getHorizontalMenuList(pathname);

    const isDesktop = useMediaQuery('(min-width: 1280px)');

    if (!isDesktop) return null;

    return (
        <div>
            <Menubar
                className={cn(
                    'py-2.5 h-auto flex-wrap bg-card border-x-0 rounded-none border-y-1 border-y-gray-300 px-20 space-x-10 items-center justify-center'
                )}
            >
                {menuList?.map(({ menus }, index) => (
                    <Fragment key={index}>
                        {menus.map(({ href, label, icon, submenus }, index) =>
                            submenus.length === 0 ? (
                                <MenubarMenu key={index}>
                                    <MenubarTrigger asChild>
                                        <Link
                                            href={href}
                                            className=" cursor-pointer"
                                        >
                                            <LucideIcon
                                                name={icon}
                                                className=" h-5 w-5 me-2"
                                            />
                                            {label}
                                        </Link>
                                    </MenubarTrigger>
                                </MenubarMenu>
                            ) : (
                                <MenubarMenu key={index}>
                                    <MenubarTrigger className=" cursor-pointer items-center">
                                        <LucideIcon
                                            name={icon}
                                            className=" me-1.5 leading-1 text-lg"
                                        />
                                        <span>{label}</span>
                                        <ChevronDown className="ms-1 h-4 w-4" />
                                    </MenubarTrigger>
                                    <MenubarContent>
                                        {submenus.map(
                                            (
                                                {
                                                    href,
                                                    label,
                                                    icon,
                                                    children: subChildren
                                                },
                                                index
                                            ) =>
                                                subChildren?.length === 0 ? (
                                                    <MenubarItem
                                                        key={`sub-index-${index}`}
                                                        className=" cursor-pointer"
                                                        asChild
                                                    >
                                                        <Link href={href}>
                                                            <LucideIcon
                                                                name={icon}
                                                                className="text-base me-1.5"
                                                            />
                                                            {label}
                                                        </Link>
                                                    </MenubarItem>
                                                ) : (
                                                    <Fragment
                                                        key={`sub-in-${index}`}
                                                    >
                                                        <MenubarSub>
                                                            <MenubarSubTrigger>
                                                                <Link
                                                                    href={href}
                                                                    className="flex cursor-pointer"
                                                                >
                                                                    {icon && (
                                                                        <LucideIcon
                                                                            name={
                                                                                icon
                                                                            }
                                                                            className="text-lg me-1.5"
                                                                        />
                                                                    )}
                                                                    {label}
                                                                </Link>
                                                            </MenubarSubTrigger>
                                                            <MenubarSubContent>
                                                                {subChildren?.map(
                                                                    (
                                                                        {
                                                                            href,
                                                                            label
                                                                        },
                                                                        index
                                                                    ) => (
                                                                        <MenubarItem
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <Link
                                                                                href={
                                                                                    href
                                                                                }
                                                                                className="flex cursor-pointer"
                                                                            >
                                                                                {
                                                                                    label
                                                                                }
                                                                            </Link>
                                                                        </MenubarItem>
                                                                    )
                                                                )}
                                                            </MenubarSubContent>
                                                        </MenubarSub>
                                                    </Fragment>
                                                )
                                        )}
                                    </MenubarContent>
                                </MenubarMenu>
                            )
                        )}
                    </Fragment>
                ))}
            </Menubar>
        </div>
    );
};

export default NavMenu;
