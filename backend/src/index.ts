import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { put } from "@vercel/blob";
import dotenv from "dotenv";
import sequelize from "./db/db";
import { generateTextFromPrompt } from "./ai";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3001;

const activityTimeout = 10000;

const logs: { activity: string; timestamp: string }[] = [];

sequelize.sync().then(() => {
  console.log("Database synced");
});

const pushActivityLog = async (activity: string) => {
  logs.push({
    activity,
    timestamp: new Date().toISOString(),
  });
  const blob = await put("sami-logs.json", JSON.stringify(logs), {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: activityTimeout / 1000,
  });
  console.log(blob);
};

app.get("/", (req, res) => {
  res.send("Matrix agent backend is running.");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Matrix agent listening on port ${port}`);

  setInterval(async () => {
    const log = await generateTextFromPrompt(
      "Output a random text message like an terminal AI Agent working on actions. Your name is SAMI."
    );

    if (log) {
      console.log(log.text);
      pushActivityLog(log.text);
    }
  }, activityTimeout);
});
