import '../libs/cssfn-preload'
import '@cssfn/cssfn-dom'

import type { AppProps } from 'next/app'



export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
