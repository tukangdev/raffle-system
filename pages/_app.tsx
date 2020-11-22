import React from "react";
import { AppProps } from "next/dist/next-server/lib/router/router";
import "../styles/globals.css";
import { ReactQueryDevtools } from "react-query-devtools";
import { QueryCache, ReactQueryCacheProvider } from "react-query";

const queryCache = new QueryCache();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <Component {...pageProps} />
      </ReactQueryCacheProvider>
      <ReactQueryDevtools initialIsOpen />
    </>
  );
}

export default MyApp;
