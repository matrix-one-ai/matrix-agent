import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import sequelize from "./db/db";
import twitterAgentInit from "./twitter";
import { discordAgentInit } from "./discord";
import { telegramAgentInit } from "./telegram";
import { plantTelegramAgentInit } from "./telegram/plantTelegram";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3001;

export const activityTimeout = 10000;

sequelize.sync().then(() => {
  console.log("Database synced");
});

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

  // twitterAgentInit();
  // discordAgentInit();
  // telegramAgentInit();
  plantTelegramAgentInit();
});
