const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let users = [];

io.on("connection", (socket) => {

  socket.on("join", (name) => {
    users.push({ id: socket.id, name });
    io.emit("users", users);
  });

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", {
      ...data,
      status: "delivered"
    });
  });

  // when other user opens chat
  socket.on("seen", () => {
    socket.broadcast.emit("updateSeen");
  });

  socket.on("disconnect", () => {
    users = users.filter((u) => u.id !== socket.id);
    io.emit("users", users);
  });
});

server.listen(5000, () => {
  console.log("Server running on 5000");
});
