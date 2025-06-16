import Link from 'next/link';
import {
    ChevronDown,
    User,
    Megaphone,
    SendHorizonal,
    Phone,
    Power
} from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import NavSignOutButton from '@/components/Navigation/NavSignOutButton';

const NavProfileInfo = async () => {
    return (
        <div className="md:block hidden">
            <DropdownMenu>
                <DropdownMenuTrigger asChild className=" cursor-pointer">
                    <div className=" flex items-center gap-3  text-default-800 ">
                        <Image
                            src="/images/users/user-1.jpg"
                            alt="Homer Simpson"
                            width={36}
                            height={36}
                            className="rounded-full"
                        />
                        <div className="text-sm font-medium  capitalize lg:block hidden  ">
                            Homer Simpson
                        </div>
                        <span className="text-base  me-2.5 lg:inline-block hidden">
                            <ChevronDown />
                        </span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-0" align="end">
                    <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
                        <Image
                            src="/images/users/user-1.jpg"
                            alt="Homer Simpson"
                            width={36}
                            height={36}
                            className="rounded-full"
                        />
                        <div>
                            <div className="text-sm font-medium text-default-800 capitalize ">
                                Homer Simpson
                            </div>
                            <div className="text-xs text-default-600 hover:text-primary">
                                homer@thesimpsons.com
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <Link href="/profile" className="cursor-pointer">
                            <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                                <User className="w-4 h-4" />
                                Profile
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/Billing" className="cursor-pointer">
                            <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                                <Megaphone className="w-4 h-4" />
                                Billing
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/settings" className="cursor-pointer">
                            <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                                <SendHorizonal className="w-4 h-4" />
                                Settings
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <Link href="/support" className="cursor-pointer">
                            <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                                <Phone className="w-4 h-4" />
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
