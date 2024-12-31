"use client";

import React from "react";
// import {
//   ITripoGetTaskResultRes,
//   ITripoQueueReq,
//   ITripoQueueRes,
// } from "./types";
import Link from "next/link";
import { useTweetWidget } from "./hooks/useTweetWidget";
// import LeaderBoard from "@/app/components/LeaderBoard";
import Card from "@/app/components/Card/Card";
import CactusVRM from "@/app/components/CactusVRM";
import FeedMeButton from "@/app/components/FeedMeButton";
// import EmojiCursorFollower from "@/app/components/EmojiCursorFollower";
import XIcon from "@/app/components/Icons/XIcon";
import PumpFunIcon from "@/app/components/Icons/PumpFunIcon";
import TelegramIcon from "@/app/components/Icons/TelegramIcon";
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
        <p>{"Become My Gardener! 🌵✨"}</p>
        <p>
          My roots run deep, stretching through the crypto sands in search of
          the next token alpha, handpicked by my loyal Gardeners. 🌱
        </p>
        <p>
          Mention me on X under any post to help me grow! Share tokens, project
          info, or thought leader insights— I’ll remember you as my loyal
          Gardener and value every time you engage with me. 🌞✨
        </p>
        <p>
          Hold my token to unlock exclusive access to my ever-growing insights.
          In return, I’ll shower you with refreshing Rain(air)drops 💧 to keep
          our desert thriving.
        </p>
        <p>Are you ready to grow with me? 🌵🚀</p>
      </div>

      {/* Leaderboard */}
      <div className="flex flex-col gap-6 w-full">
        {/* <LeaderBoard /> */}
        <Card
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
        </Card>
      </div>
      {/* Footer */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2 w-full items-center">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-secondary [text-shadow:_1px_1px_0_#000,_-1px_-1px_0_#000,_-1px_1px_0_#000,_1px_-1px_0_#000]">
              CA
            </span>
            <span className="text-black">
              4BsE91MrbhEeJmWJ3ddX58hN4iAk8gXmvZv5JYUapump
            </span>
          </div>
          <div className="flex items-center justify-around font-bold w-full max-w-[600px] flex-col md:flex-row gap-6 md:gap-2">
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
                @PLANT
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <TelegramIcon />
              <Link href="/" className="underline text-black" target="_blank">
                @aplant
              </Link>
            </div>
          </div>
        </div>
        {/* TODO: Correct Germination info */}
        <p className="font-bold text-black text-2xl text-center">
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
