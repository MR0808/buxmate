export type SubChildren = {
    href: string;
    label: string;
    active: boolean;
    children?: SubChildren[];
};
export type Submenu = {
    href: string;
    label: string;
    active: boolean;
    icon: any;
    submenus?: Submenu[];
    children?: SubChildren[];
};

export type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: any;
    submenus: Submenu[];
    id: string;
};

export type Group = {
    groupLabel: string;
    menus: Menu[];
    id: string;
};

const getMenuList = (pathname: string): Group[] => {
    return [
        {
            groupLabel: 'dashboard',
            id: 'dashboard',
            menus: [
                {
                    id: 'dashboard',
                    href: '/dashboard/analytics',
                    label: 'dashboard',
                    active: pathname.includes('/dashboard'),
                    icon: 'House',
                    submenus: [
                        {
                            href: '/dashboard/analytics',
                            label: 'analytics',
                            active: pathname === '/dashboard/analytics',
                            icon: 'Arrow',
                            children: []
                        },
                        {
                            href: '/dashboard/dash-ecom',
                            label: 'ecommerce',
                            active: pathname === '/dashboard/dash-ecom',
                            icon: 'ShoppingCart',
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            groupLabel: 'apps',
            id: 'app',
            menus: [
                {
                    id: 'chat',
                    href: '/app/chat',
                    label: 'chat',
                    active: pathname.includes('/app/chat'),
                    icon: 'MessageCircleMore',
                    submenus: []
                },
                {
                    id: 'email',
                    href: '/app/email',
                    label: 'email',
                    active: pathname.includes('/app/email'),
                    icon: 'Mail',
                    submenus: []
                },

                {
                    id: 'calendar',
                    href: '/app/calendar',
                    label: 'calendar',
                    active: pathname.includes('/app/calendar'),
                    icon: 'CalendarMinus2',
                    submenus: []
                }
            ]
        },
        {
            groupLabel: 'user',
            id: 'user',
            menus: [
                {
                    id: 'settings',
                    href: '/settings',
                    label: 'settings',
                    active: pathname.includes('/settings'),
                    icon: 'Cog',
                    submenus: []
                }
            ]
        }
    ];
};

export const getHorizontalMenuList = (pathname: string): Group[] => {
    return [
        {
            groupLabel: 'dashboard',
            id: 'dashboard',
            menus: [
                {
                    id: 'dashboard',
                    href: '/dashboard/analytics',
                    label: 'dashboard',
                    active: pathname.includes('/dashboard'),
                    icon: 'House',
                    submenus: [
                        {
                            href: '/dashboard/analytics',
                            label: 'analytics',
                            active: pathname === '/dashboard/analytics',
                            icon: 'Arrow',
                            children: []
                        },
                        {
                            href: '/dashboard/dash-ecom',
                            label: 'ecommerce',
                            active: pathname === '/dashboard/dash-ecom',
                            icon: 'ShoppingCart',
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            groupLabel: 'apps',
            id: 'app',
            menus: [
                {
                    id: 'chat',
                    href: '/app/chat',
                    label: 'chat',
                    active: pathname.includes('/app/chat'),
                    icon: 'MessageCircleMore',
                    submenus: []
                },
                {
                    id: 'email',
                    href: '/app/email',
                    label: 'email',
                    active: pathname.includes('/app/email'),
                    icon: 'Mail',
                    submenus: []
                },

                {
                    id: 'calendar',
                    href: '/app/calendar',
                    label: 'calendar',
                    active: pathname.includes('/app/calendar'),
                    icon: 'CalendarMinus2',
                    submenus: []
                }
            ]
        }
    ];
};

export default getMenuList;
