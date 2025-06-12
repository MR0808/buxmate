'use client';

import Link from 'next/link';
import Image from 'next/image';

const NavLogo = () => {
    return (
        <Link href="/" className="flex gap-2 items-center    ">
            <Image
                src="/images/logo/logo.png"
                alt="Buxmate"
                height={64}
                width={120}
                className="text-default-900 h-16 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background"
            />
        </Link>
    );
};

export default NavLogo;
