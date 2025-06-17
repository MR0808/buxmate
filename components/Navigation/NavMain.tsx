import NavContent from './NavContent';
import NavLogo from './NavLogo';
import NavMenu from './NavMenu';
import NavMessages from './NavMessages';
import NavMobileMenu from './NavMobileMenu';
import NavNotifications from './NavNotifications';
import NavProfileInfo from './NavProfileInfo';
import ThemeSwitcher from './ThemeSwitcher';
import { NavProps } from '@/types/nav';

const NavMain = ({ session }: NavProps) => {
    return (
        <>
            <NavContent>
                <div className=" flex gap-3 items-center">
                    <NavLogo />
                </div>
                <div className="nav-tools flex items-center  md:gap-4 gap-3">
                    <ThemeSwitcher />
                    <NavMessages />
                    <NavNotifications />
                    <NavProfileInfo session={session} />
                    <NavMobileMenu />
                </div>
            </NavContent>
            <NavMenu />
        </>
    );
};
export default NavMain;
