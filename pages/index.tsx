import React from "react";
import Head from "next/head";
import {
  fetchData,
  getRandomName,
  updateWinnerName,
  useConfig,
  useNames,
  useRandomName,
} from "../queries";
import Button from "../components/button";
import Confetti from "react-confetti";
import { useWindowSize } from "../lib/useWindowResize";
import firebaseAdmin from "../lib/firebase";
import { timeout } from "../lib/helpers";
import { useQueryCache } from "react-query";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth.verifyIdToken(cookies.token);
    const { uid, email } = token;

    // the user is authenticated!
    // FETCH STUFF HERE

    return {
      props: { message: `Your email is ${email} and your UID is ${uid}.` },
    };
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    return {
      redirect: {
        permanent: false,
        destination: "/admin/login",
      },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {} as never,
    };
  }
};

export default function Home() {
  const queryCache = useQueryCache();
  const {
    isFetching: isLoadingConfig,
    isError: isErrorConfig,
    data: configData,
    error,
  } = useConfig();

  const { width, height } = useWindowSize();

  const [cursorInArea, setCursorInArea] = React.useState(false);
  const [isShuffle, setIsShuffle] = React.useState(false);
  const [isSelectCard, setIsSelectCard] = React.useState(false);
  const [flipCard, setFlipCard] = React.useState(false);
  const [
    randomName,
    setRandomName,
  ] = React.useState<FirebaseFirestore.DocumentData>();

  React.useEffect(() => {}, [randomName, isSelectCard]);

  const startInterval = () =>
    new Promise(async (resolve) => {
      setIsShuffle(true);
      await timeout(configData?.data.shuffleInterval || 3000);
      setIsSelectCard(true);
      await timeout(1000);
      setFlipCard(true);
      await timeout(configData?.data.cardRevealInterval || 3000);
      setFlipCard(false);
      await timeout(1000);
      setIsSelectCard(false);
      // randomName && (await updateWinnerName(randomName));
      await timeout(1000);
      setIsShuffle(false);
      resolve();
    });

  const getCardBackgroundColors = () => {
    switch (configData?.data.gradient) {
      case 3: {
        return `linear-gradient(to bottom right, ${configData?.data.cardBgColor[0]}, ${configData?.data.cardBgColor[1]}, ${configData?.data.cardBgColor[2]})`;
      }
      case 2: {
        return `linear-gradient(to bottom right, ${configData?.data.cardBgColor[0]}, ${configData?.data.cardBgColor[1]})`;
      }
      default: {
        return `${configData?.data.cardBgColor[0]}`;
      }
    }
  };

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
          {!isShuffle && (
            <div className="absolute -bottom-36 left-1/2 z-100 transform -translate-x-1/2 -translate-y-1/2">
              <Button
                className={`border border-black  z-100 transition-all duration-500 ease-in-out ${
                  cursorInArea ? "opacity-100" : "opacity-0"
                } hover:scale-110`}
                onClick={async () => {
                  const randomNameData = await getRandomName();
                  setRandomName(randomNameData);
                  await startInterval();
                  randomNameData && (await updateWinnerName(randomNameData));
                  queryCache.invalidateQueries("names");
                  queryCache.invalidateQueries("namesPaginate");
                }}
              >
                PICK A WINNER
              </Button>
            </div>
          )}
          <div
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
                background: getCardBackgroundColors(),
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
              {randomName?.data.name}
            </div>
          </div>
          <div
            style={{
              background: getCardBackgroundColors(),
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
              background: getCardBackgroundColors(),
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
              background: getCardBackgroundColors(),
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
              background: getCardBackgroundColors(),
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
