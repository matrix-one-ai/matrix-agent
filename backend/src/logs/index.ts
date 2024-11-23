import { put } from "@vercel/blob";
import { activityTimeout } from "..";

const logs: { activity: string; timestamp: string }[] = [];

export const pushActivityLog = async (activity: string) => {
  logs.push({
    activity,
    timestamp: new Date().toISOString(),
  });

  // Limit logs to the latest 100 entries
  if (logs.length > 100) {
    logs.splice(0, logs.length - 100);
  }

  await put("sami-logs.json", JSON.stringify(logs), {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: activityTimeout / 1000,
  });
  console.log("Activity log pushed:", activity.slice(0, 50));
};
