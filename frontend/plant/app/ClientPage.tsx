"use client";

import React from "react";
// import {
//   ITripoGetTaskResultRes,
//   ITripoQueueReq,
//   ITripoQueueRes,
// } from "./types";
import Link from "next/link";
import { useTweetWidget } from "./hooks/useTweetWidget";
import LatestTweets from "@/app/components/LatestTweets";
import LeaderBoard from "@/app/components/LeaderBoard";
import RisingSproutsComingSoon from "@/app/components/RisingSproutsComingSoon";
import SproutTokensComingSoon from "@/app/components/SproutTokensComingSoon";
// import Card from "@/app/components/Card/Card";
import CactusVRM from "@/app/components/CactusVRM";
import FeedMeButton from "@/app/components/FeedMeButton";
// import ClipboardCopy from "@/app/components/ClipboardCopy";
// import EmojiCursorFollower from "@/app/components/EmojiCursorFollower";
import XIcon from "@/app/components/Icons/XIcon";
import PumpFunIcon from "@/app/components/Icons/PumpFunIcon";
import TelegramIcon from "@/app/components/Icons/TelegramIcon";
import CoinMarketIcon from "@/app/components/Icons/CoinMarketIcon";
// import ClipboardIcon from "@/app/components/Icons/ClipboardIcon";
import { getDaysBetweenDates } from "./utils/string";

const ClientPage = () => {
  useTweetWidget();

  // TODO: Below code does run for Tripo gen
  // ----------------------------------------------------------------------------
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // // Queue Tripo task to generate 3d model from prompt
  // const queueTripoTask = useCallback(async () => {
  //   try {
  //     const data: ITripoQueueReq = {
  //       type: "text_to_model",
  //       model_version: "v2.0-20240919",
  //       prompt: "a small cactus",
  //       model_seed: 1,
  //       face_limit: 3000,
  //     };
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_TRIPO_SERVER_URL}/api/tripo/task`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(
  //         `HTTP error! status: ${response.status}, info: ${response.statusText}`
  //       );
  //     }
  //     const result: ITripoQueueRes = await response.json();

  //     return result.taskId;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);

  // // Get Tripo task progress
  // const getTripoTaskResult = useCallback(async (taskId: string) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_TRIPO_SERVER_URL}/api/tripo/task/${taskId}`
  //     );

  //     if (!response.ok) {
  //       throw new Error(
  //         `HTTP error! status: ${response.status},info : ${response.statusText}`
  //       );
  //     }
  //     const result = await response.json();

  //     return result.data as ITripoGetTaskResultRes;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);

  // // Open hello world page
  // const handleGenerateModel = useCallback(async () => {
  //   const tripoTaskId = await queueTripoTask();

  //   if (!tripoTaskId) return;

  //   console.info("Tripo task id: ", tripoTaskId);
  //   let modelData = await getTripoTaskResult(tripoTaskId);

  //   intervalRef.current = setInterval(async () => {
  //     console.info("Polling to check Tripo task progress...");
  //     modelData = await getTripoTaskResult(tripoTaskId);

  //     if (modelData?.status && modelData.status === "success") {
  //       console.warn("Tripo model data: ", modelData);
  //       clearInterval(intervalRef.current as unknown as NodeJS.Timeout);
  //     }
  //   }, 2000);
  // }, [queueTripoTask, getTripoTaskResult]);
  // ----------------------------------------------------------------------------

  return (
    <div className="flex w-full flex-col items-center gap-10 pb-10 max-w-[1024px]">
      {/* <button
        className="bg-blue-500 text-white py-2 px-4"
        onClick={handleGenerateModel}
      >
        Generate
      </button> */}

      <CactusVRM />
      <FeedMeButton />
      <div className="flex flex-col gap-6 font-bold text-base md:text-2xl px-4">
        <p>
          My roots run deep across the cryptoverse, in search of the next token
          alpha. 🌱
        </p>
        <p>
          Mention me on X under any post about a crypto project. If the token
          has not launched I will tell you when it launches. If the token has
          launched you can track it here.
        </p>
        <p>
          As my Gardener I will shower you with Rain(air)drops 💧. The more
          mentions with engagement, relevance, depth, novelty and sentiment the
          more Rain(air)drops you earn. 🌞✨
        </p>
        <p>
          Stake my token to unlock access to my ever-growing insights here and
          on TG.🌵🚀
        </p>
      </div>

      {/* Leaderboard */}
      <div className="flex flex-col gap-6 w-full">
        <LeaderBoard />
        <RisingSproutsComingSoon />
        <SproutTokensComingSoon />
        <LatestTweets />
        {/* <Card
          contentClassName="!overflow-auto"
          className="max-h-[90vh]"
          title="My Words"
        >
          <div className="flex flex-col !h-[564px] w-full gap-3">
            <a
              className="twitter-timeline text-center py-2 underline"
              data-theme="light"
              data-chrome="noheader nofooter noborders transparent"
              href="https://twitter.com/plantdotfun?ref_src=twsrc%5Etfw"
              target="_blank"
            >
              Tweets by @plantdotfun
            </a>
          </div>
        </Card> */}
      </div>
      {/* Footer */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2 w-full items-center">
          <div className="flex flex-col md:flex-row items-center gap-2 font-bold text-sm md:text-base">
            <div className="flex items-center gap-2">
              {/* <ClipboardIcon /> */}
              <span className="text-secondary [text-shadow:_1px_1px_0_#000,_-1px_-1px_0_#000,_-1px_1px_0_#000,_1px_-1px_0_#000]">
                CA
              </span>
            </div>
            <span className="text-black">
              4BsE91MrbhEeJmWJ3ddX58hN4iAk8gXmvZv5JYUapump
            </span>
          </div>
          <div className="flex items-center justify-around font-bold w-full flex-col md:flex-row gap-6 md:gap-2">
            <div className="flex items-center gap-2">
              <XIcon />
              <Link
                href="https://x.com/plantdotfun"
                className="underline text-black"
                target="_blank"
              >
                @plantdotfun
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <XIcon />
              <Link
                href="https://x.com/thegardenerteam"
                className="underline text-black"
                target="_blank"
              >
                @thegardenerteam
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <PumpFunIcon />
              <Link
                href="https://pump.fun/coin/4BsE91MrbhEeJmWJ3ddX58hN4iAk8gXmvZv5JYUapump"
                className="underline text-black"
                target="_blank"
              >
                pump.fun
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <TelegramIcon />
              <Link
                href="https://t.me/portalplant"
                className="underline text-black"
                target="_blank"
              >
                @aplant
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <CoinMarketIcon />
              <Link
                href="https://coinmarketcap.com/currencies/plant/"
                className="underline text-black"
                target="_blank"
              >
                coinmarketcap
              </Link>
            </div>
          </div>
        </div>
        {/* TODO: Correct Germination info */}
        <p className="font-bold text-black text-center">
          Days Since Germination:{" "}
          {getDaysBetweenDates(new Date(), new Date("2025-01-01"))}
        </p>
      </div>
      {/* TODO: Confirm if we'll need waterdrop following cursor later. If not rid of completely */}
      {/* <EmojiCursorFollower /> */}
    </div>
  );
};

export default ClientPage;
