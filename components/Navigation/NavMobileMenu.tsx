'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AlignRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetHeader,
    SheetContent,
    SheetTrigger
} from '@/components/ui/sheet';
import NavMenuClassic from './NavMenuClassic';
import { useMobileMenuConfig } from '@/hooks/use-mobile-menu';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useConfig } from '@/hooks/use-config';

const NavMobileMenu = () => {
    const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();
    const { isOpen } = mobileMenuConfig;
    const [config, setConfig] = useConfig();

    const isDesktop = useMediaQuery('(min-width: 1280px)');
    if (isDesktop) return null;
    return (
        <Sheet
            open={isOpen}
            onOpenChange={() => setMobileMenuConfig({ isOpen: !isOpen })}
        >
            <SheetTrigger className="xl:hidden" asChild>
                <Button
                    className="h-8"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        setConfig({
                            ...config,
                            collapsed: false
                        })
                    }
                >
                    <AlignRight className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent
                className="sm:w-72 px-3 h-full flex flex-col"
                side="left"
            >
                <SheetHeader>
                    <Link href="/" className="flex gap-2 items-center     ">
                        <Image
                            src="/images/logo/logo.png"
                            alt="Buxmate"
                            height={64}
                            width={120}
                            className="text-default-900 h-16 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background"
                        />
                    </Link>
                </SheetHeader>
                <NavMenuClassic />
            </SheetContent>
        </Sheet>
    );
};

export default NavMobileMenu;
