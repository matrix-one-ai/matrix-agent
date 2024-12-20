"use client";

import React from "react";
// import {
//   ITripoGetTaskResultRes,
//   ITripoQueueReq,
//   ITripoQueueRes,
// } from "./types";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import ModelViewer from "./components/ModelViewer";
import { Model as Cactus1 } from "./components/gltf/Cactus1";
import Card from "./components/Card/Card";
import { useTweetWidget } from "./hooks/useTweetWidget";
import Tooltip from "@/app/components/Tooltip";
import AmmoProgress from "@/app/components/AmmoChart";
import XIcon from "@/app/components/Icons/XIcon";
import PumpFunIcon from "@/app/components/Icons/PumpFunIcon";
import TelegramIcon from "@/app/components/Icons/TelegramIcon";
import { MOCK_DATA } from "./constants";

const ClientPage = () => {
  const twttrWidgetLoading = useTweetWidget();

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
    <div className="flex w-full flex-col items-center gap-10 pb-10">
      {/* <button
        className="bg-blue-500 text-white py-2 px-4"
        onClick={handleGenerateModel}
      >
        Generate
      </button> */}

      <ModelViewer gltfComponent={<Cactus1 scale={[5, 5, 5]} />} />

      <div className="w-full flex flex-col items-center gap-10 pb-10 max-w-[1024px]">
        <Link
          href="https://twitter.com/intent/tweet?screen_name=x&ref_src=twsrc%5Etfw"
          className="flex justify-center items-center bg-secondary w-64 h-16 rounded-[50px] text-black border-black border-2 font-bold text-2xl"
          target="_blank"
        >
          💦 Feed Me Words 💦
        </Link>
        <div className="flex flex-col gap-6 font-bold text-2xl text-center">
          <p>
            My roots run deep, stretching through the crypto sands in search of
            the fastest-growing tokens, handpicked by my loyal Gardeners. 🌱
          </p>
          <p>
            Hold my token, and you’ll unlock exclusive access to my ever-growing
            insights. 🌵 I remember all my Gardeners and our memories together.
          </p>
          <p>
            You will be showered with refreshing water(air)drops to keep our
            desert thriving. Are you ready to grow with me?
          </p>
        </div>

        {/* Leaderboard */}
        <div className="flex flex-col gap-6 w-full">
          <Card contentClassName="!overflow-auto" title="My Words">
            <div className="flex flex-col !h-[564px] w-full gap-3">
              <a
                className={clsx(
                  "twitter-timeline",
                  twttrWidgetLoading && "hidden",
                )}
                data-theme="light"
                data-chrome="noheader nofooter noborders transparent"
                href="https://twitter.com/OnlyOneSami?ref_src=twsrc%5Etfw"
                target="_blank"
              >
                Tweets by @OnlyOneSami
              </a>
              {twttrWidgetLoading && (
                <a
                  className="text-center py-2 underline"
                  href="https://twitter.com/intent/tweet?screen_name=x&ref_src=twsrc%5Etfw"
                  target="_blank"
                >
                  [Tweet to @x]
                </a>
              )}
            </div>
          </Card>
          <Card
            contentClassName="flex flex-col !p-0 !h-[750px]"
            title="My Gardeners"
          >
            <div className="relative w-full h-0 flex-grow px-4 overflow-auto [clip-path:inset(0_16px_round_0)]">
              <table className="w-full min-w-[750px] table-fixed overflow-x-auto font-bold border-collapse">
                <thead className="sticky top-0 bg-primary z-10">
                  <tr className="text-left h-11">
                    <th className="w-[15%] sticky left-0 bg-primary">User</th>
                    <th className="w-[10%] text-center">
                      <Tooltip content="The number of Mentions and therefore memories saved by Plan in its Relationship database">
                        Mentions
                      </Tooltip>
                    </th>
                    <th className="text-center">
                      <Tooltip content="The total engagement (Replies, Retweets, Likes, Views) with your mentions with Plant">
                        Engagement
                      </Tooltip>
                    </th>
                    <th className="text-center">
                      <Tooltip content="Relevance of your Mention with Plant on X. It should be related to tokens or wallets or crypto projects.">
                        Relevance
                      </Tooltip>
                    </th>
                    <th className="text-center">
                      <Tooltip content="Depth in your Mention with Plant on X. The more information and words the more it learns.">
                        Depth
                      </Tooltip>
                    </th>
                    <th className="text-center">
                      <Tooltip content="Novelty in your Mentions with Plant on X. New tokens and projects are valued more. Tokens that have never been mentioned before.">
                        Novelty
                      </Tooltip>
                    </th>
                    <th className="text-center">
                      <Tooltip content="Sentiment in your mentions with Plant on X. Positive sentiment is valued more.">
                        Sentiment
                      </Tooltip>
                    </th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_DATA.map(
                    (
                      {
                        avatar,
                        twitter_handler,
                        twitter_link,
                        mentions,
                        engagement,
                        relevance,
                        depth,
                        novelty,
                        sentiment,
                        score,
                        level,
                      },
                      i,
                    ) => (
                      <tr
                        key={`ranking-${i}`}
                        className={clsx("h-9", i % 2 === 0 && "bg-[#decca2]")}
                      >
                        <td
                          className={clsx(
                            "sticky left-0 px-4",
                            i % 2 === 0 ? "bg-[#decca2]" : "bg-primary",
                          )}
                        >
                          <div className="flex items-center">
                            <Image
                              src={avatar}
                              className="w-5 h-5 object-cover rounded-full mr-2"
                              width={128}
                              height={128}
                              alt=""
                            />
                            @
                            <Link
                              className="underline truncate"
                              href={twitter_link}
                              target="_blank"
                            >
                              {twitter_handler}
                            </Link>
                          </div>
                        </td>
                        <td className="text-center">{mentions}</td>
                        <td>
                          <AmmoProgress id="engagement" value={engagement} />
                        </td>
                        <td>
                          <AmmoProgress
                            id="relevance"
                            value={relevance}
                            color="bg-[#FFC107]"
                          />
                        </td>
                        <td>
                          <AmmoProgress
                            id="depth"
                            value={depth}
                            color="bg-[#8B5A2B]"
                          />
                        </td>
                        <td>
                          <AmmoProgress
                            id="novelty"
                            value={novelty}
                            color="bg-[#4E944F]"
                          />
                        </td>
                        <td>
                          <AmmoProgress
                            id="sentiment"
                            value={sentiment}
                            color="bg-[#F58634]"
                          />
                        </td>
                        <td>
                          <div className="flex items-center w-full justify-between pr-8">
                            <span>{score}</span>
                            <span>
                              {level < 20
                                ? "🌱"
                                : level < 40
                                  ? "🪴"
                                  : level < 60
                                    ? "☀️"
                                    : level < 80
                                      ? "🌸"
                                      : "👑"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center px-9 h-11 font-bold text-[10px]">
              <Tooltip
                content="Entry Level: New members who’ve just started contributing. They plant the seeds of engagement by mentioning the cactus occasionally. Requirements: Minimal contributions like basic mentions or interactions."
                placement="bottom"
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs">🌱 (0 - 20%)</span>
                  <span>Seed Planters</span>
                </div>
              </Tooltip>
              <Tooltip
                content="Intermediate Level: Members who consistently provide relevant and thoughtful mentions, helping the cactus grow strong roots. Requirements: Regular participation with more relevant and deeper mentions."
                placement="bottom"
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs">🪴 (20 - 40%)</span>
                  <span>Soil Tenders</span>
                </div>
              </Tooltip>
              <Tooltip
                content="Advanced Level: Highly active members whose mentions are consistently engaging, positive, and insightful, acting as the cactus's main source of growth. Requirements: High-quality mentions, positive sentiment, and creative contributions."
                placement="bottom"
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs">☀️ (40 - 60%)</span>
                  <span>Sunlight Bringers</span>
                </div>
              </Tooltip>
              <Tooltip
                content="Expert Level: Top-tier contributors who bring novelty, enthusiasm, and drive engagement across the community, making the cactus thrive. Requirements: Exceptional engagement, introducing novel ideas, and driving significant community activity."
                placement="bottom"
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs">🌸 (60 - 80%)</span>
                  <span>Blossom Cultivators</span>
                </div>
              </Tooltip>
              <Tooltip
                content="Elite Level: The most dedicated and impactful members who consistently lead the community, provide key insights, and help others contribute. They are the ultimate nurturers of the cactus’s growth. Requirements: Leadership in engagement, top-quality contributions, and recognition as community role models."
                placement="bottom"
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs">👑 (80 - 100%)</span>
                  <span>Master Gardeners</span>
                </div>
              </Tooltip>
            </div>
          </Card>
        </div>
        {/* Footer */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2 w-full items-center">
            <div className="flex items-center gap-2 font-bold">
              <span className="text-[38px] text-secondary [text-shadow:_1px_1px_0_#000,_-1px_-1px_0_#000,_-1px_1px_0_#000,_1px_-1px_0_#000]">
                CA
              </span>
              <span className="underline text-black">
                xxxxxxxxxxxxxxxxxxxxxxxx
              </span>
            </div>
            <div className="flex items-center justify-around font-bold w-full max-w-[600px]">
              <div className="flex items-center gap-2">
                <XIcon />
                <Link href="/" className="underline text-black">
                  @aplant
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <PumpFunIcon />
                <Link href="/" className="underline text-black">
                  @aplant
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <TelegramIcon />
                <Link href="/" className="underline text-black">
                  @aplant
                </Link>
              </div>
            </div>
          </div>
          {/* TODO: Correct Germination info */}
          <p className="font-bold text-black text-2xl text-center">
            Days Since Germination: 123
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
