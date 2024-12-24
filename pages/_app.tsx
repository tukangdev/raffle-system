import React from 'react'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import '../styles/globals.css'
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import { Analytics } from '@vercel/analytics/react'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<Hydrate state={pageProps.dehydratedState}>
					<Component {...pageProps} />
				</Hydrate>
				<ReactQueryDevtools initialIsOpen />
			</QueryClientProvider>
			<Analytics />
		</>
	)
}

export default MyApp
