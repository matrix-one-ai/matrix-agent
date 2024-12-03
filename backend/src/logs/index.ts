import { put } from "@vercel/blob";
import { activityTimeout } from "..";

interface ActivityLog {
  moduleType: "twitter";
  title: string;
  description: string;
  timestamp: string;
  tweetId?: string;
}

const logs: ActivityLog[] = [];

export const pushActivityLog = async ({
  moduleType,
  title,
  description,
  tweetId,
}: Omit<ActivityLog, "timestamp">) => {
  const resp = await fetch(
    "https://fnfscfgwilvky5z8.public.blob.vercel-storage.com/sami-logs.json"
  );

  const logs = await resp.json();

  logs.push({
    moduleType,
    title,
    description,
    timestamp: new Date().toISOString(),
    ...(tweetId && { tweetId }),
  });

  await put("sami-logs.json", JSON.stringify(logs), {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: activityTimeout / 1000,
  });
  console.log("Activity log pushed:", title, description.slice(0, 50));
};

export const wipeLogs = async () => {
  await put("sami-logs.json", JSON.stringify([]), {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: activityTimeout / 1000,
  });
}
