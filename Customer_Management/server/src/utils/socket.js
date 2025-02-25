const socketIO = require("socket.io");

let io;

exports.initSocket = (server) => {
  io = socketIO(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
  });
};

exports.sendNotification = (message, data) => {
  if (io) io.emit("notification", { message, data });
};
