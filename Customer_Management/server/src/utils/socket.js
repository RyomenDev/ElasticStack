// const socketIO = require("socket.io");
import { Server } from "socket.io";


let io;

export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
  });
};

export const sendNotification = (message, data) => {
  if (io) io.emit("notification", { message, data });
};
