"use client";

import React, { useCallback, useRef } from "react";

const ClientPage = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const generateModel = useCallback(async () => {
    try {
      const url = "https://api.tripo3d.ai/v2/openapi/task";

      const data = {
        type: "text_to_model",
        model_version: "v2.0-20240919",
        prompt: "a small cactus",
        model_seed: 1,
        face_limit: 3000,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TRIPO_API_KEY}`,
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, info: ${response.statusText}`,
        );
      }
      const result = await response.json();
      console.log(result);

      return result.data.task_id;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getModel = useCallback(async (taskId: string) => {
    try {
      const url = `https://api.tripo3d.ai/v2/openapi/task/${taskId}`;

      const options = {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TRIPO_API_KEY}`,
        },
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status},info : ${response.statusText}`,
        );
      }
      const result = await response.json();

      return result;
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Open hello world page
  const handleGenerateModel = useCallback(async () => {
    const tripoTaskId = await generateModel();
    console.log("Tripo task id: ", tripoTaskId);
    let modelData = await getModel(tripoTaskId);

    intervalRef.current = setInterval(async () => {
      console.log("polling..");
      modelData = await getModel(tripoTaskId);

      if (Object.keys(modelData?.data?.output).length > 0) {
        console.warn("Generated output: ", modelData?.data?.output);
        clearInterval(intervalRef.current as unknown as NodeJS.Timeout);
      }
    }, 2000);
  }, [generateModel, getModel]);

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
