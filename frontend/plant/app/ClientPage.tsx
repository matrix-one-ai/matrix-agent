"use client";

import React, { useCallback, useRef } from "react";
import {
  ITripoGetTaskResultRes,
  ITripoQueueReq,
  ITripoQueueRes,
} from "./types";

const ClientPage = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Queue Tripo task to generate 3d model from prompt
  const queueTripoTask = useCallback(async () => {
    try {
      const data: ITripoQueueReq = {
        type: "text_to_model",
        model_version: "v2.0-20240919",
        prompt: "a small cactus",
        model_seed: 1,
        face_limit: 3000,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TRIPO_SERVER_URL}/api/tripo/task`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, info: ${response.statusText}`
        );
      }
      const result: ITripoQueueRes = await response.json();

      return result.taskId;
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Get Tripo task progress
  const getTripoTaskResult = useCallback(async (taskId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TRIPO_SERVER_URL}/api/tripo/task/${taskId}`
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status},info : ${response.statusText}`
        );
      }
      const result = await response.json();

      return result.data as ITripoGetTaskResultRes;
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Open hello world page
  const handleGenerateModel = useCallback(async () => {
    const tripoTaskId = await queueTripoTask();

    if (!tripoTaskId) return;

    console.info("Tripo task id: ", tripoTaskId);
    let modelData = await getTripoTaskResult(tripoTaskId);

    intervalRef.current = setInterval(async () => {
      console.info("Polling to check Tripo task progress...");
      modelData = await getTripoTaskResult(tripoTaskId);

      if (modelData?.status && modelData.status === "success") {
        console.warn("Tripo model data: ", modelData);
        clearInterval(intervalRef.current as unknown as NodeJS.Timeout);
      }
    }, 2000);
  }, [queueTripoTask, getTripoTaskResult]);

  return (
    <div className="flex w-full max-w-[1024px] flex-col gap-6 pb-10">
      <button
        className="bg-blue-500 text-white py-2 px-4"
        onClick={handleGenerateModel}
      >
        Generate
      </button>
    </div>
  );
};

export default ClientPage;
