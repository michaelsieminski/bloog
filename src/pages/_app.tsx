import '@/styles/globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
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
                <Component {...pageProps} />
            </ClerkProvider>
        </>
    )
}
