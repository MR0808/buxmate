import SiteBreadcrumb from '@/components/Global/SiteBreadcrumb';

import { authCheck } from '@/lib/authCheck';
import SettingsMain from '@/components/Settings/SettingsMain';

const settings = async () => {
    const userSession = await authCheck();

    return (
        <div>
            <SiteBreadcrumb />
            <div className="flex flex-row gap-20">
                <SettingsMain userSession={userSession} />
            </div>
        </div>
    );
};

export default settings;
