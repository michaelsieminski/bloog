import React, { ReactNode, useContext } from 'react'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import Logo from '@/components/Logo'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

interface LayoutProps {
    children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isLoaded, isSignedIn, user } = useUser()

    const subscribe = async () => {
        if (isLoaded && isSignedIn) {
            await fetch('/api/payment', {
                method: 'POST',
                body: JSON.stringify({
                    userId: user.id,
                }),
            })
                .then((response) => {
                    return response.json()
                })
                .then((jsonData) => {
                    window.location.href = jsonData.url
                })
        }
    }

    return (
        <>
            <main className={`min-h-screen bg-light ${inter.className}`}>
                <nav className="fixed flex items-center justify-between w-full h-16 px-12 bg-white bg-opacity-80 backdrop-blur-[3px] shadow-soft">
                    <div className="flex items-center space-x-4">
                        <Logo />

                        <Link
                            href="/"
                            className="pl-8 text-sm transition opacity-60 hover:opacity-100">
                            Home
                        </Link>
                    </div>

                    <SignedIn>
                        <UserButton
                            appearance={{
                                userProfile: {
                                    elements: {
                                        badge: 'text-black hover:no-underline transition hover:text-black opacity-70 hover:opacity-100 bg-black bg-opacity-10',
                                        profileSectionPrimaryButton:
                                            'text-black hover:no-underline transition hover:text-black opacity-70 hover:opacity-100 hover:bg-black hover:bg-opacity-10',
                                        formButtonReset:
                                            'text-black hover:no-underline transition hover:text-black opacity-70 hover:opacity-100 hover:bg-black hover:bg-opacity-10',
                                        formButtonPrimary:
                                            'text-black hover:no-underline transition hover:text-black opacity-70 hover:opacity-100 bg-black bg-opacity-10 hover:bg-black hover:text-white',
                                        formFieldInput: 'accent-black',
                                    },
                                },
                            }}
                        />
                    </SignedIn>

                    <SignedOut>
                        <div className="flex items-center space-x-2">
                            <Link
                                className="px-3 py-1 text-sm transition rounded-md hover:bg-neutral-100 opacity-80 hover:opacity-100"
                                href="/sign-in">
                                Sign In
                            </Link>

                            <Link
                                className="px-3 py-1 text-sm transition-all rounded-md bg-light opacity-80 hover:opacity-100 active:scale-95 shadow-soft"
                                href="/sign-in">
                                Create account
                            </Link>
                        </div>
                    </SignedOut>
                </nav>

                {/* <SignedIn>
                    <div className="fixed z-50 w-screen h-screen bg-opacity-60 bg-light backdrop-blur-[3px]">
                        <div className="absolute flex flex-col items-center justify-center p-8 -translate-x-1/2 -translate-y-1/2 bg-white drop-shadow-xl rounded-xl left-1/2 top-1/2 shadow-soft">
                            <div className="pointer-events-none">
                                <Logo />
                            </div>

                            <h2 className="mt-4 text-xl font-medium">You&apos;ve ran out of Credits.</h2>
                            <p className="max-w-sm mt-2 text-sm text-center opacity-70">
                                If you wish to keep using bloog and get access to even more amazing features, feel free
                                to subscribe.
                            </p>

                            <p className="mt-6 text-sm font-medium">$9.99 /month</p>

                            <button
                                onClick={subscribe}
                                className="flex items-center px-3 py-1 mt-1 text-sm transition-all rounded-md bg-light opacity-80 hover:opacity-100 active:scale-95 shadow-soft">
                                <svg
                                    className="mr-2"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M18.25 19.25V10.75C18.25 9.64543 17.3546 8.75 16.25 8.75H7.75C6.64543 8.75 5.75 9.64543 5.75 10.75V19.25"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"></path>
                                    <path
                                        d="M11.75 11.25H12.25"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"></path>
                                    <path
                                        d="M8.75 6.25C8.75 6.25 9.5 4.75 12 4.75C14.5 4.75 15.25 6.25 15.25 6.25"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"></path>
                                </svg>
                                Subscribe now
                            </button>
                        </div>
                    </div>
                </SignedIn> */}

                <div className="px-12 pt-24 pb-6">{children}</div>
            </main>
        </>
    )
}

export default Layout
