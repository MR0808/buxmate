// components/LucideIcon.tsx
import * as Icons from 'lucide-react';

interface LucideIconProps {
    name: string;
    className?: string;
}

export const LucideIcon = ({ name, className }: LucideIconProps) => {
    const IconComponent = (
        Icons as unknown as Record<string, React.ComponentType<any>>
    )[name];

    if (!IconComponent) {
        console.warn(`Lucide icon "${name}" not found.`);
        return null;
    }

    return <IconComponent className={className} />;
};
