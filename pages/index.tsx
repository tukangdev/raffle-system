import React from "react";
import Head from "next/head";
import { useConfig, useNames, useRandomName } from "../queries";
import Button from "../components/button";
import Confetti from "react-confetti";
import { useWindowSize } from "../lib/useWindowResize";

export default function Home() {
  const {
    isFetching: isLoadingConfig,
    isError: isErrorConfig,
    data: configData,
    error,
  } = useConfig();

  const { data: nameData } = useRandomName();

  const { width, height } = useWindowSize();

  const [cursorInArea, setCursorInArea] = React.useState(false);
  const [isShuffle, setIsShuffle] = React.useState(false);
  const [isSelectCard, setIsSelectCard] = React.useState(false);
  const [flipCard, setFlipCard] = React.useState(false);

  return (
    <>
      <Head>
        <title>Creative Network Raffle</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isSelectCard && flipCard && <Confetti width={width} height={height} />}
      <div
        className={`relative h-screen w-screen bg-no-repeat bg-cover bg-center transition-opacity duration-1000 ease-in ${
          configData ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${configData?.data.bgImage})` }}
      >
        <p className="bg-white p-4 text-center sm:hidden">
          To run this raffle, you must at least be on a tablet.
        </p>
        <div
          className="absolute hidden sm:block mx-auto max-w-lg w-full h-100"
          onMouseEnter={() => setCursorInArea(true)}
          onMouseLeave={() => setCursorInArea(false)}
          style={{ transform: "translate(-50%,-50%)", top: "50%", left: "50%" }}
        >
          <div className="absolute -bottom-36 left-1/2 z-100 transform -translate-x-1/2 -translate-y-1/2">
            <Button
              className={`border border-black  z-100 transition-all duration-500 ease-in-out ${
                cursorInArea ? "opacity-100" : "opacity-0"
              } hover:scale-110`}
              onClick={() => setIsShuffle(!isShuffle)}
            >
              {isShuffle ? "STOP RAFFLE" : "START RAFFLE"}
            </Button>
            {isShuffle && (
              <Button
                className={`border border-black transform  z-100 transition-all duration-500 ease-in-out ${
                  cursorInArea ? "opacity-100" : "opacity-0"
                } hover:scale-110`}
                onClick={() => {
                  setIsSelectCard(!isSelectCard);
                }}
              >
                {isSelectCard ? "BACK TO RAFFLE" : "PICK WINNER"}
              </Button>
            )}
          </div>
          <div
            onClick={() => {
              if (isShuffle && isSelectCard) {
                setFlipCard(!flipCard);
              }
            }}
            style={{ transformStyle: "preserve-3d" }}
            className={`shadow-lg bg-transparent absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2   items-center transition-all transform duration-500 ease-in-out ${
              cursorInArea && !isShuffle
                ? "-translate-x-64 -translate-y-32 -rotate-36"
                : isShuffle && !isSelectCard
                ? "-translate-x-64 -translate-y-32 -rotate-0 animate-cardToBack1"
                : isShuffle && isSelectCard && !flipCard
                ? "-translate-x-1/2 -translate-y-1/2 scale-150 -rotate-0"
                : isShuffle && isSelectCard && flipCard
                ? "animate-flipCard"
                : "-translate-x-1/2 -translate-y-1/2 rotate-0"
            } z-50`}
          >
            <div
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                MozBackfaceVisibility: "hidden",
                backgroundImage: `linear-gradient(to bottom right, ${configData?.data.cardBgColor[0]}, ${configData?.data.cardBgColor[1]}, ${configData?.data.cardBgColor[2]})`,
              }}
              className="absolute w-full h-full rounded-2xl flex justify-center items-center"
            >
              <img
                src={configData?.data.cardLogoImage}
                className="h-32 w-32 rounded-full"
              />
            </div>
            <div
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                MozBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              className="absolute w-full h-full bg-white rounded-2xl flex justify-center items-center"
            >
              {nameData?.data.name}
            </div>
          </div>
          <div
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${configData?.data.cardBgColor[0]}, ${configData?.data.cardBgColor[1]}, ${configData?.data.cardBgColor[2]})`,
            }}
            className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2  items-center transform transition-all duration-500 ease-in-out ${
              cursorInArea && !isShuffle
                ? "-translate-x-48 -translate-y-40  -rotate-18"
                : isShuffle && !isSelectCard
                ? "-translate-x-48 -translate-y-40 -rotate-0 animate-cardToBack2"
                : isShuffle && isSelectCard
                ? "-translate-x-48 -translate-y-40 -rotate-0"
                : "-translate-x-1/2 -translate-y-1/2 rotate-0 "
            } z-40`}
          >
            <div
              className="absolute"
              style={{
                transform: "translate(-50%,-50%)",
                top: "50%",
                left: "50%",
              }}
            >
              <img
                src={configData?.data.cardLogoImage}
                className="h-32 w-32 rounded-full"
              />
            </div>
          </div>
          <div
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${configData?.data.cardBgColor[0]}, ${configData?.data.cardBgColor[1]}, ${configData?.data.cardBgColor[2]})`,
            }}
            className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2  items-center transition-all transform duration-500 ease-in-out ${
              cursorInArea && !isShuffle
                ? "-translate-x-32 -translate-y-40 -rotate-9"
                : isShuffle && !isSelectCard
                ? "-translate-x-32 -translate-y-48 -rotate-0 animate-cardToBack3"
                : isShuffle && isSelectCard
                ? "-translate-x-32 -translate-y-48 -rotate-0"
                : "-translate-x-1/2 -translate-y-1/2 rotate-0"
            } z-30`}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img
                src={configData?.data.cardLogoImage}
                className="h-32 w-32 rounded-full"
              />
            </div>
          </div>
          <div
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${configData?.data.cardBgColor[0]}, ${configData?.data.cardBgColor[1]}, ${configData?.data.cardBgColor[2]})`,
            }}
            className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2   items-center transition-all transform duration-500 ease-in-out ${
              cursorInArea && !isShuffle
                ? "-translate-x-16 -translate-y-40 -rotate-0"
                : isShuffle && !isSelectCard
                ? "-translate-x-16 -translate-y-56 -rotate-0 animate-cardToBack4"
                : isShuffle && isSelectCard
                ? "-translate-x-16 -translate-y-56 -rotate-0"
                : "-translate-x-1/2 -translate-y-1/2 rotate-0"
            } z-20`}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img
                src={configData?.data.cardLogoImage}
                className="h-32 w-32 rounded-full"
              />
            </div>
          </div>
          <div
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${configData?.data.cardBgColor[0]}, ${configData?.data.cardBgColor[1]}, ${configData?.data.cardBgColor[2]})`,
            }}
            className={`bg-primary shadow-lg absolute w-64 h-96 rounded-2xl flex justify-center top-1/2 left-1/2   items-center transition-all transform duration-500 ease-in-out ${
              cursorInArea && !isShuffle
                ? "-translate-x-4 -translate-y-36 rotate-9"
                : isShuffle && !isSelectCard
                ? "-translate-x-4 -translate-y-64 -rotate-0 animate-cardToBack5"
                : isShuffle && isSelectCard
                ? "-translate-x-4 -translate-y-64 -rotate-0"
                : "-translate-x-1/2 -translate-y-1/2 rotate-0"
            } z-10`}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img
                src={configData?.data.cardLogoImage}
                className="h-32 w-32 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
