"use client";

import React from "react";
// import {
//   ITripoGetTaskResultRes,
//   ITripoQueueReq,
//   ITripoQueueRes,
// } from "./types";
import ModelViewer from "./components/ModelViewer";
import { Model as Cactus1 } from "./components/gltf/Cactus1";
import Card from "./components/Card/Card";
import clsx from "clsx";
import { useTweetWidget } from "./hooks/useTweetWidget";
import { MOCK_DATA } from "./constants";
import XIcon from "@/app/components/Icons/XIcon";
import PumpFunIcon from "@/app/components/Icons/PumpFunIcon";
import TelegramIcon from "@/app/components/Icons/TelegramIcon";
import Image from "next/image";
import Link from "next/link";

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
            <div className="w-full h-0 flex-grow px-4 overflow-auto">
              <table className="w-full min-w-[750px] table-fixed overflow-x-auto font-bold border-collapse">
                <thead className="sticky top-0 bg-primary">
                  <tr className="text-left h-11">
                    <th className="w-[18%]">User</th>
                    <th className="w-[10%]">Mentions</th>
                    <th className="w-[12%]">Engagement</th>
                    <th className="w-[12%]">Relevance</th>
                    <th className="w-[12%]">Depth</th>
                    <th className="w-[12%]">Novelty</th>
                    <th className="w-[12%]">Sentiment</th>
                    <th className="w-[12%]">Score</th>
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
                      },
                      i,
                    ) => (
                      <tr
                        key={`ranking-${i}`}
                        className={clsx("h-9", i % 2 === 0 && "bg-black/10")}
                      >
                        <td
                          className={clsx(
                            "px-2",
                            i === 0 && "rounded-tl-[20px]",
                            i === MOCK_DATA.length - 1 && "rounded-bl-[20px]",
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
                              className="underline"
                              href={twitter_link}
                              target="_blank"
                            >
                              {twitter_handler}
                            </Link>
                          </div>
                        </td>
                        <td>
                          <span>{mentions}</span>
                        </td>
                        <td>
                          <span>{engagement}</span>
                        </td>
                        <td>
                          <span>{relevance}</span>
                        </td>
                        <td>
                          <span>{depth}</span>
                        </td>
                        <td>
                          <span>{novelty}</span>
                        </td>
                        <td>
                          <span>{sentiment}</span>
                        </td>
                        <td
                          className={clsx(
                            i === 0 && "rounded-tr-[20px]",
                            i === MOCK_DATA.length - 1 && "rounded-br-[20px]",
                          )}
                        >
                          <span>{`💦 ${score}`}</span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center px-9 h-11 font-bold text-[10px]">
              <div className="flex flex-col items-center">
                <span className="text-xs">🌱 (0 - 20%)</span>
                <span>Seed Planters</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs">🪴 (20 - 40%)</span>
                <span>Soil Tenders</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs">☀️ (40 - 60%)</span>
                <span>Sunlight Bringers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs">🌸 (60 - 80%)</span>
                <span>Blossom Cultivators</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs">👑 (80 - 100%)</span>
                <span>Master Gardeners</span>
              </div>
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
