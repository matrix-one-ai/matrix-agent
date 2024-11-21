import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AgentLog } from "../types";

const ActivityLog = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch(
        "https://fnfscfgwilvky5z8.public.blob.vercel-storage.com/sami-logs.json"
      );
      const data = await response.json();

      console.log(data);
      setAgentLogs(data);
    };

    fetchLogs();

    setInterval(() => {
      fetchLogs();
    }, 5000);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentLogs]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflowY: "scroll",
        overflowX: "hidden",
        padding: "1rem 2rem",
        margin: "0 auto",
      }}
    >
      {agentLogs.slice(-100).map((log, index) => (
        <div
          key={index}
          style={{
            padding: "1rem",
          }}
        >
          <ReactMarkdown>{log.activity}</ReactMarkdown>
          <p>{log.timestamp}</p>
        </div>
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ActivityLog;
