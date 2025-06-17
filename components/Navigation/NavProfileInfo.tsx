import Link from 'next/link';
import { ChevronDown, CircleHelp, Cog } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import NavSignOutButton from '@/components/Navigation/NavSignOutButton';
import { NavProps } from '@/types/nav';

const NavProfileInfo = async ({ session }: NavProps) => {
    if (!session) return null;

    return (
        <div className="md:block hidden">
            <DropdownMenu>
                <DropdownMenuTrigger asChild className=" cursor-pointer">
                    <div className=" flex items-center gap-3  text-default-800 ">
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                alt={`${session.user.name} ${session.user.lastName}`}
                                width={36}
                                height={36}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="size-9 border border-priamry rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <span className="uppercase text-base font-bold">
                                    {`${session.user.name.slice(0, 1)}${session.user.lastName.slice(0, 1)}`}
                                </span>
                            </div>
                        )}
                        <div className="text-sm font-medium  capitalize lg:block hidden  ">
                            {`${session.user.name} ${session.user.lastName}`}
                        </div>
                        <span className="text-base  me-2.5 lg:inline-block hidden">
                            <ChevronDown />
                        </span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-0" align="end">
                    <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                alt={`${session.user.name} ${session.user.lastName}`}
                                width={36}
                                height={36}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="size-9 border border-priamry rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <span className="uppercase text-base font-bold">
                                    {`${session.user.name.slice(0, 1)}${session.user.lastName.slice(0, 1)}`}
                                </span>
                            </div>
                        )}
                        <div>
                            <div className="text-sm font-medium text-default-800 capitalize ">
                                {`${session.user.name} ${session.user.lastName}`}
                            </div>
                            <div className="text-xs text-default-600 hover:text-primary">
                                {session.user.email}
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <Link href="/settings" className="cursor-pointer">
                            <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                                <Cog className="w-4 h-4" />
                                Settings
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <Link href="/support" className="cursor-pointer">
                            <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                                <CircleHelp className="w-4 h-4" />
                                Support
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="mb-0 dark:bg-background" />
                    <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 cursor-pointer">
                        <div>
                            <NavSignOutButton />
                            {/* <button
                                type="button"
                                className=" w-full cursor-pointer flex  items-center gap-2"
                            >
                                <Power className="w-4 h-4" />
                                Log out
                            </button> */}
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
export default NavProfileInfo;
