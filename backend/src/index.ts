import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import sequelize from "./db/db";

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

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
});
