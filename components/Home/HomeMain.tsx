import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DollarSign,
    Users,
    CreditCard,
    Activity,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { DashboardTabs } from './DashboardTabs';
import Link from 'next/link';

const stats = [
    {
        title: 'Total Revenue',
        value: '$45,231.89',
        change: '+20.1% from last month',
        icon: DollarSign,
        trend: 'up'
    },
    {
        title: 'Subscriptions',
        value: '+2350',
        change: '+180.1% from last month',
        icon: Users,
        trend: 'up'
    },
    {
        title: 'Sales',
        value: '+12,234',
        change: '+19% from last month',
        icon: CreditCard,
        trend: 'up'
    },
    {
        title: 'Active Now',
        value: '+573',
        change: '+201 since last hour',
        icon: Activity,
        trend: 'up'
    }
];

const recentSales = [
    {
        name: 'Olivia Martin',
        email: 'olivia.martin@email.com',
        amount: '+$1,999.00',
        avatar: 'OM'
    },
    {
        name: 'Jackson Lee',
        email: 'jackson.lee@email.com',
        amount: '+$39.00',
        avatar: 'JL'
    },
    {
        name: 'Isabella Nguyen',
        email: 'isabella.nguyen@email.com',
        amount: '+$299.00',
        avatar: 'IN'
    },
    {
        name: 'William Kim',
        email: 'will@email.com',
        amount: '+$99.00',
        avatar: 'WK'
    },
    {
        name: 'Sofia Davis',
        email: 'sofia.davis@email.com',
        amount: '+$39.00',
        avatar: 'SD'
    }
];

const HomeMain = () => {
    return (
        <div className="flex-1 space-y-6 ">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                </div>
                <Link href="/event/create">
                    <Button>Create an Event</Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                                {stat.trend === 'up' ? (
                                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                                )}
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Sales */}
            </div>
        </div>
    );
};

export default HomeMain;
