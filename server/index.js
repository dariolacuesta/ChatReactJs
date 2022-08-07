import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import { PORT } from "./config.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
const users = [];
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: { origin: "*" },
});
const _dirname = dirname(fileURLToPath(import.meta.url));
app.use(cors());
app.use(morgan("dev"));
app.use(express.static(join(__dirname, "../client/build")));
io.on("connection", (socket) => {
  console.log(`User id:${socket.id} Connected`);

  socket.on("join-chat", (username) => {
    const newUser = {
      id: socket.id,
      username,
    };
    users.push(newUser);
    socket.broadcast.emit("message", {
      body: `${newUser.username} has joined the chat`,
      from: "Bot",
    });
  });

  socket.on("message", (message) => {
    const user = users.find((user) => user.id === socket.id).username;
    socket.broadcast.emit("message", { body: message, from: user });
  });
});

server.listen(PORT);
console.log(`Server started and listening on port ${PORT}`);
