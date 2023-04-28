import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import Logo from '@/components/Logo'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    return (
        <main className={`flex min-h-screen flex-col items-center justify-between bg-light ${inter.className}`}>
            <nav className="flex items-center justify-between w-full h-16 px-12 bg-white shadow-soft">
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
                            className="px-3 py-1 text-sm transition rounded-md bg-light opacity-80 hover:opacity-100 shadow-soft"
                            href="/sign-in">
                            Create account
                        </Link>
                    </div>
                </SignedOut>
            </nav>
        </main>
    )
}
