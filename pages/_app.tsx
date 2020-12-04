import React from "react";
import { AppProps } from "next/dist/next-server/lib/router/router";
import "../styles/globals.css";
import { ReactQueryDevtools } from "react-query-devtools";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { AuthProvider } from "../lib/auth-context";

const queryCache = new QueryCache();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <Hydrate state={pageProps.dehydratedState}>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </Hydrate>
      </ReactQueryCacheProvider>
      <ReactQueryDevtools initialIsOpen />
    </>
  );
}

export default MyApp;
