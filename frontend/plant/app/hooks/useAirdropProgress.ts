import { useEffect, useState } from "react";
import {
  AIRDROP_INTERVAL,
  AIRDROP_PROGRESS_MILESTONE_COUNT,
  AIRDROP_START_DATE,
} from "@/app/constants";

function getAirdropProgress(): number {
  const currentDate = new Date();
  const actualStartDate = new Date(AIRDROP_START_DATE);
  const actualEndDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  actualStartDate.setHours(0, 0, 0, 0);
  actualEndDate.setHours(0, 0, 0, 0);
  actualEndDate.setDate(actualStartDate.getDate() + AIRDROP_INTERVAL);

  if (currentDate <= actualStartDate) {
    return 0;
  }

  // Ensure the currentDate is after the start date, otherwise adjust
  while (!(actualStartDate <= currentDate && actualEndDate > currentDate)) {
    actualStartDate.setDate(actualStartDate.getDate() + AIRDROP_INTERVAL);
    actualEndDate.setDate(actualStartDate.getDate() + AIRDROP_INTERVAL);
  }

  // Get the number of days between the start date and the current date
  const diffInMs = Math.abs(currentDate.getTime() - actualStartDate.getTime());
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

  // Calculate the progress
  const progress = diffInDays / AIRDROP_INTERVAL;
  const rescaledProgress = Math.round(
    AIRDROP_PROGRESS_MILESTONE_COUNT * progress,
  );

  return rescaledProgress;
}

/**
 * Hooks for airdrop progress
 */
function useAirdropProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(getAirdropProgress());

    const interval = setInterval(
      () => {
        setProgress(getAirdropProgress());
      },
      1000 * 60 * 60,
    ); // Check progress every 1 hour

    return () => clearInterval(interval);
  }, []);

  return progress;
}

export default useAirdropProgress;
