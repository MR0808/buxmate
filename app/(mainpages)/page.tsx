import HomeMain from '@/components/Home/HomeMain';
import { authCheck } from '@/lib/authCheck';

const HomePage = async () => {
    const { user, session } = await authCheck();

    return <HomeMain />;
};

export default HomePage;
