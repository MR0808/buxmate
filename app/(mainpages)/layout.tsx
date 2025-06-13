import NavMain from '@/components/Navigation/NavMain';

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NavMain />
            <div className="min-h-screen bg-background">
                <main className="flex-1 px-6 md:px-20 py-6">{children}</main>
            </div>
        </>
    );
}
