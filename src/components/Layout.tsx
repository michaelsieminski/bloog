import React, { ReactNode } from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import Logo from '@/components/Logo'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

interface LayoutProps {
    children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <main className={`min-h-screen bg-light ${inter.className}`}>
                <nav className="fixed flex items-center justify-between w-full h-16 px-12 bg-white bg-opacity-80 backdrop-blur-[3px] shadow-soft">
                    <Logo />

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

                <div className="px-12 pt-24 pb-6">{children}</div>
            </main>
        </>
    )
}

export default Layout
