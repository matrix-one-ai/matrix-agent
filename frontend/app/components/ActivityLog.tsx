import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ActivityLog } from "../types";

const useTypewriter = (text: string, speed: number, chunkSize: number) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.slice(index, index + chunkSize));
      index += chunkSize;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, chunkSize]);

  return displayedText;
};

const ActivityLogList = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [agentLogs, setAgentLogs] = useState<ActivityLog[]>([]);

  const lastLog = agentLogs.length > 0 ? agentLogs[agentLogs.length - 1] : null;
  const typewriterText = useTypewriter(
    lastLog ? lastLog.description : "",
    100,
    20
  );

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
  }, [agentLogs, typewriterText]);

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
      {agentLogs.slice(-100, -1).map((log, index) => (
        <div
          key={index}
          style={{
            padding: "1rem",
          }}
        >
          <ReactMarkdown>{log.description}</ReactMarkdown>
          <p>{log.timestamp}</p>
        </div>
      ))}
      {lastLog && (
        <div
          style={{
            padding: "1rem",
          }}
        >
          <ReactMarkdown>{typewriterText}</ReactMarkdown>
          <p>{new Date(lastLog.timestamp).toUTCString()}</p>
        </div>
      )}
      <div ref={scrollRef} />
    </div>
  );
};

export default ActivityLogList;
