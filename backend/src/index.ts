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
  await put("sami-logs.json", JSON.stringify(logs), {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: activityTimeout / 1000,
  });
  console.log("Activity log pushed:", activity.slice(0, 50));
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
      `Output a random text message like an terminal AI Agent working on actions. Your name is SAMI.
      Output funky retro metaverse ascii art sometimes. Make it very cool and digital matrix style / cyberpunk.
      Send random actions, make it look like you are working on something. Make it look like you are a cool AI Agent working on a cool project.
      `,
      { temperature: 0.8, frequencyPenalty: 0.8, presencePenalty: 0.8 }
    );

    if (log) {
      pushActivityLog(log.text);
    }
  }, activityTimeout);
});
