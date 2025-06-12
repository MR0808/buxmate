import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type Config = {
    collapsed: boolean;
    menuHidden: boolean;
    showSearchBar: boolean;
    showSwitcher: boolean;
    subMenu: boolean;
    hasSubMenu: boolean;
    radius: number;
};
export const defaultConfig: Config = {
    collapsed: false,
    menuHidden: false,
    showSearchBar: true,
    showSwitcher: true,
    subMenu: false,
    hasSubMenu: false,
    radius: 0.5
};

const configAtom = atomWithStorage<Config>('config', defaultConfig);

export function useConfig() {
    return useAtom(configAtom);
}
