import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }, // Allow all origins (configure for production)
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Handle client disconnect
    socket.on("disconnect", () =>
      console.log(`❌ Client disconnected: ${socket.id}`)
    );
  });
};

// Emit a specific event to all connected clients
export const emitEvent = (event, data) => {
  if (io) {
    io.emit(event, data);
    console.log(`📢 Event emitted: ${event}`, data);
  }
};

// Helper function for sending notifications
export const sendNotification = (message, data) => {
  emitEvent("notification", { message, data });
};
