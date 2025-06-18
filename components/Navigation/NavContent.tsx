'use client';

import { cn } from '@/lib/utils';
import { useConfig } from '@/hooks/use-config';

const NavContent = ({ children }: { children: React.ReactNode }) => {
    const [config] = useConfig();

    return (
        <header
            className={cn('bg-white top-0 z-50 md:px-14', 'sticky', {
                'has-sticky-header': true
            })}
        >
            <div
                className={cn(
                    'flex-none bg-header backdrop-blur-lg md:px-6 px-[15px] py-3 xl:ms-[248px] flex items-center justify-between relative ',
                    { 'xl:ms-[72px]': config.collapsed, 'xl:ms-0': true }
                )}
            >
                {children}
            </div>
        </header>
    );
};

export default NavContent;
