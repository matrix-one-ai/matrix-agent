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
import { MOCK_RANKING_DATA } from "./constants";
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
    <div className="flex w-full max-w-[1024px] flex-col items-center gap-10 pb-10">
      {/* <button
        className="bg-blue-500 text-white py-2 px-4"
        onClick={handleGenerateModel}
      >
        Generate
      </button> */}

      <ModelViewer gltfComponent={<Cactus1 scale={[5, 5, 5]} />} />
      <Link
        href="https://twitter.com/intent/tweet?screen_name=x&ref_src=twsrc%5Etfw"
        className="flex justify-center items-center bg-secondary w-64 h-16 rounded-[50px] text-black border-black border-2 font-bold text-2xl"
        target="_blank"
      >
        💦 Feed Me Words 💦
      </Link>

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
        <Card contentClassName="!overflow-auto" title="My Gardeners">
          <table className="!h-[564px] w-full min-w-[750px] gap-3 overflow-x-auto font-bold border-collapse">
            <tbody>
              {MOCK_RANKING_DATA.map(
                (
                  {
                    ranking,
                    avatar,
                    twitter_handler,
                    twitter_link,
                    cactus_age,
                    cactus_germination,
                    score,
                    improved,
                  },
                  i,
                ) => (
                  <tr key={`ranking-${i}`} className="flex items-center gap-3">
                    <td className="w-[10%] text-center">
                      <span>{`#${ranking}`}</span>
                    </td>
                    <td className="w-[10%]">
                      <Image
                        src={avatar}
                        className="w-12 h-12 object-cover rounded-full border-2 border-secondary"
                        width={128}
                        height={128}
                        alt=""
                      />
                    </td>
                    <td className="w-[20%] flex items-center gap-1">
                      <XIcon />
                      <div className="flex items-center gap-0">
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
                    <td className="w-[20%]">
                      <span>{cactus_age}</span>
                    </td>
                    <td className="w-[20%]">
                      <span>{cactus_germination}</span>
                    </td>
                    <td className="w-[20%] flex items-center gap-1 justify-center">
                      <span>{`💦 ${score}`}</span>
                      <span
                        className={clsx(
                          improved ? "text-secondary" : "text-red-500",
                        )}
                      >
                        {improved ? "▲" : "▼"}
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
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
  );
};

export default ClientPage;
