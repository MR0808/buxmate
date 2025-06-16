import Link from 'next/link';
import Image from 'next/image';

const LoginErrorPage = async ({
    searchParams
}: {
    searchParams: Promise<{ error: string }>;
}) => {
    const sp = await searchParams;
    return (
        <>
            <div
                className="flex w-full items-center overflow-hidden min-h-dvh h-dvh basis-full bg-cover bg-no-repeat bg-center z-0"
                style={{
                    backgroundImage: `url(/images/backgrounds/auth-bg.jpg)`
                }}
            >
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="overflow-y-auto flex flex-wrap w-full h-dvh z-20">
                    <div className="lg:block hidden flex-1 overflow-hidden text-[40px] leading-[48px] text-default-600 lg:w-1/2">
                        <div className="flex justify-center items-center min-h-screen">
                            <Link href="/" className="">
                                <Image
                                    src="/images/logo/logo-white.png"
                                    alt="Buxmate"
                                    height={386}
                                    width={386}
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full flex flex-col items-center justify-center">
                        <div className="bg-default-50  relative h-auto  lg:mr-[150px] mr-auto p-10 md:rounded-md max-w-[520px] w-full ml-auto text-2xl text-default-900  mb-3">
                            <div className="flex justify-center items-center text-center mb-6 lg:hidden ">
                                <Link href="/">
                                    <Image
                                        src="/images/logo/logo.png"
                                        alt="Buxmate"
                                        height={64}
                                        width={120}
                                        className="text-default-900 h-16 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background"
                                    />
                                </Link>
                            </div>
                            <div className="text-center 2xl:mb-10 mb-5">
                                <h4 className="font-medium">
                                    Error with Login
                                </h4>
                                <div className="text-default-500  text-base">
                                    {sp.error === 'account_not_linked'
                                        ? 'This account is already linked to another sign-in method.'
                                        : 'Oops! Something went wrong. Please try again.'}
                                </div>
                            </div>
                            <div className="mx-auto font-normal text-default-500  2xl:mt-12 mt-6 uppercase text-sm text-center">
                                Back to
                                <Link
                                    href="/auth/login"
                                    className="text-default-900 font-medium hover:underline ps-1"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 lg:block hidden text-white py-5 px-5 text-xl w-full">
                        Make your next big night{' '}
                        <span className="text-white font-bold ms-1">
                            easier
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginErrorPage;
