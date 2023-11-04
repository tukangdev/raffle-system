import React from 'react'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import '../styles/globals.css'
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import { AuthProvider } from '../lib/auth-context'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<Hydrate state={pageProps.dehydratedState}>
					<AuthProvider>
						<Component {...pageProps} />
					</AuthProvider>
				</Hydrate>
				<ReactQueryDevtools initialIsOpen />
			</QueryClientProvider>
		</>
	)
}

export default MyApp
