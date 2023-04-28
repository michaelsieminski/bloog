import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import Landing from '@/components/Landing'

export default function Home() {
    return (
        <>
            <SignedOut>
                <Landing />
            </SignedOut>

            <SignedIn>
                <Link
                    href="/articles/generate"
                    className="flex items-center justify-center px-3 py-1 ml-auto text-sm transition-all rounded-md active:scale-95 hover:bg-white w-44 opacity-80 hover:opacity-100 shadow-soft">
                    <svg
                        className="mr-2"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M4.75 19.25L9 18.25L18.2929 8.95711C18.6834 8.56658 18.6834 7.93342 18.2929 7.54289L16.4571 5.70711C16.0666 5.31658 15.4334 5.31658 15.0429 5.70711L5.75 15L4.75 19.25Z"></path>
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M19.25 19.25H13.75"></path>
                    </svg>
                    New Article
                </Link>

                <section
                    id="articles"
                    className="p-6 mt-4 bg-white rounded-lg shadow-soft">
                    <h2 className="mb-4 text-xl font-medium">Your Articles</h2>
                    <p className="text-sm text-black text-opacity-50">No Articles found.</p>
                </section>
            </SignedIn>
        </>
    )
}
