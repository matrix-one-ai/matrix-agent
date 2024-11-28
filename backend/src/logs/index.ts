import { put } from "@vercel/blob";
import { activityTimeout } from "..";

interface ActivityLog {
  moduleType: "twitter";
  title: string;
  description: string;
  timestamp: string;
}

const logs: ActivityLog[] = [];

export const pushActivityLog = async ({
  moduleType,
  title,
  description,
}: Omit<ActivityLog, "timestamp">) => {
  logs.push({
    moduleType,
    title,
    description,
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
  console.log("Activity log pushed:", title, description.slice(0, 50));
};
