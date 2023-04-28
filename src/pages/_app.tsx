import Layout from '@/components/Layout'
import '@/styles/globals.css'

import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Head from 'next/head'

const publicPages = ['/sign-in/[[...index]]', '/sign-up/[[...index]]']

const App = ({ Component, pageProps }: AppProps) => {
    const { pathname } = useRouter()
    const isPublicPage = publicPages.includes(pathname)

    return (
        <>
            <Head>
                <title>bloog - Your AI Blog Companion</title>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="/favicon.svg"></link>
                <link
                    rel="icon"
                    type="image/png"
                    href="/favicon.png"></link>
            </Head>

            <ClerkProvider {...pageProps}>
                {isPublicPage ? (
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                ) : (
                    <>
                        <SignedIn>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </SignedIn>
                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </>
                )}
            </ClerkProvider>
        </>
    )
}

export default App
