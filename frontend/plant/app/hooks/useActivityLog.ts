import { useCallback, useEffect, useRef, useState } from "react";
import { IActivityLog } from "@/app/types";

/**
 * Hooks for fetching agent logs data
 * @returns void
 */
export function useActivityLog(): IActivityLog[] {
  const [agentLogs, setAgentLogs] = useState<IActivityLog[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch news total page with filter options
  const fetchLogs = useCallback(async () => {
    const response = await fetch(
      "https://fnfscfgwilvky5z8.public.blob.vercel-storage.com/sami-logs.json",
    );
    const data = await response.json();

    console.log(data);
    setAgentLogs(data.reverse());
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    fetchLogs();

    intervalRef.current = setInterval(() => {
      fetchLogs();
    }, 15000);
  }, [fetchLogs]);

  return agentLogs;
}
