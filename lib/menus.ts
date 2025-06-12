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

const getMenuList = (pathname: string, t: any): Group[] => {
    return [
        {
            groupLabel: t('apps'),
            id: 'app',
            menus: [
                {
                    id: 'chat',
                    href: '/app/chat',
                    label: t('chat'),
                    active: pathname.includes('/app/chat'),
                    icon: 'MessageCircleMore',
                    submenus: []
                },
                {
                    id: 'email',
                    href: '/app/email',
                    label: t('email'),
                    active: pathname.includes('/app/email'),
                    icon: 'Mail',
                    submenus: []
                },

                {
                    id: 'calendar',
                    href: '/app/calendar',
                    label: t('calendar'),
                    active: pathname.includes('/app/calendar'),
                    icon: 'CalendarMinus2',
                    submenus: []
                }
            ]
        }
    ];
};

export default getMenuList;
