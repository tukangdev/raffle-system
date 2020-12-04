import React from "react";
import Head from "next/head";
import { useConfig } from "../queries";

export default function Home() {
  const {
    isFetching: isLoadingConfig,
    isError: isErrorConfig,
    data: configData,
    error,
  } = useConfig();

  const [cursorInArea, setCursorInArea] = React.useState(false);

  return (
    <>
      <Head>
        <title>Creative Network Raffle</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`relative h-screen w-screen bg-no-repeat bg-cover bg-center transition-opacity duration-1000 ease-in ${
          configData ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${configData?.data.bgImage})` }}
      >
        <div
          className="absolute mx-auto max-w-lg w-full h-100"
          onMouseEnter={() => setCursorInArea(true)}
          onMouseLeave={() => setCursorInArea(false)}
          style={{ transform: "translate(-50%,-50%)", top: "50%", left: "50%" }}
        >
          <div
            className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2   items-center transition-all transform duration-500 ease-in-out ${
              cursorInArea
                ? "-translate-x-84 -translate-y-32 -rotate-36"
                : "-translate-x-1/2 -translate-y-1/2 rotate-0"
            } z-50`}
          >
            <div className="relative h-9/10 w-9/10  border border-white rounded-xl">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                Card 1
              </div>
            </div>
          </div>
          <div
            className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2  items-center transform transition-all duration-500 ease-in-out ${
              cursorInArea
                ? "-translate-x-64 -translate-y-40  -rotate-18"
                : "-translate-x-1/2 -translate-y-1/2 rotate-0 "
            } z-40`}
          >
            <div className="relative h-9/10 w-9/10  border border-white rounded-xl">
              <div
                className="absolute"
                style={{
                  transform: "translate(-50%,-50%)",
                  top: "50%",
                  left: "50%",
                }}
              >
                Card 2
              </div>
            </div>
          </div>
          <div
            className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2  items-center transition-all transform duration-500 ease-in-out ${
              cursorInArea
                ? "-translate-x-48 -translate-y-40 -rotate-9"
                : "-translate-x-1/2 -translate-y-1/2 rotate-0"
            } z-30`}
          >
            <div className="relative h-9/10 w-9/10  border border-white rounded-xl">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                Card 3
              </div>
            </div>
          </div>
          <div
            className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2   items-center transition-all transform duration-500 ease-in-out ${
              cursorInArea
                ? "-translate-x-32 -translate-y-40 -rotate-0"
                : "-translate-x-1/2 -translate-y-1/2 rotate-0"
            } z-20`}
          >
            <div className="relative h-9/10 w-9/10  border border-white rounded-xl">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                Card 4
              </div>
            </div>
          </div>
          <div
            className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2   items-center transition-all transform duration-500 ease-in-out ${
              cursorInArea
                ? "-translate-x-16 -translate-y-36 rotate-9"
                : "-translate-x-1/2 -translate-y-1/2 rotate-0"
            } z-10`}
          >
            <div className="relative h-9/10 w-9/10  border border-white rounded-xl">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                Card 5
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
