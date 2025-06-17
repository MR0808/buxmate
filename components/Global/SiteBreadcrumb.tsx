'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, Fragment } from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

const SiteBreadcrumb = ({ children }: { children?: ReactNode }) => {
    const location = usePathname();
    const locations = location.split('/').filter((path) => path);

    return (
        <div className="flex justify-between gap-3 items-center mb-6">
            <div className="flex-1">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/">
                                <Home className=" h-5 w-5" />
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />

                        {locations.map((link, index) => {
                            let href = `/${locations.slice(0, index + 1).join('/')}`;
                            let itemLink = link;
                            const isLast = index === locations.length - 1;
                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem className=" capitalize">
                                        {isLast ? (
                                            itemLink
                                        ) : (
                                            <Link href={href}>{itemLink}</Link>
                                        )}
                                    </BreadcrumbItem>
                                    {locations.length !== index + 1 && (
                                        <BreadcrumbSeparator />
                                    )}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className=" flex-none flex  gap-2">{children}</div>
        </div>
    );
};

export default SiteBreadcrumb;
