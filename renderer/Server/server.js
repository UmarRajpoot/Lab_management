import express from "express";
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const notifier = require("node-notifier");
console.log("Server Called");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const httpserver = app.listen(2000, () => console.log("App is Runnung.."));

const io = new Server(httpserver, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Server Connected : " + socket.id);
  socket.on("clientReq", (clientRequest) => {
    if (clientRequest.Connected) {
      io.emit("CIPTSoft", {
        clientIP: clientRequest.ClientIP,
        ISClientConnected: clientRequest.Connected,
      });
      notifier.notify({
        title: "Client Notification",
        message: "Client Is Connected" + " " + clientRequest.ClientIP,
        icon: "../../resources/icon.ico",
        appID: "Client Connection",
      });
    }
  });

  socket.on("SOFTIPToCLi", (msg) => {
    io.emit("getSoftIP", msg);
  });
  socket.on("shutdownPC", (msg) => {
    io.emit("shutdownPC", msg);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected.");
  });
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});

app.get("/", (req, res) => {
  res.send("Happy");
});
