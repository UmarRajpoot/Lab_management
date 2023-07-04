import express from "express";
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const notifier = require("node-notifier");

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

  const SocketTransport = (from, to) => {
    socket.on(from, (msg) => {
      console.log(msg);
    });
  };

  socket.on("SOFTIPToCLi", (msg) => {
    io.emit("getSoftIP", msg);
  });
  socket.on("shutdownPC", (msg) => {
    io.emit("shutdownPC", msg);
  });
  SocketTransport("assignement");

  socket.on("disconnect", () => {
    console.log("User Disconnected.");
  });
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  socket.on("assignmentAdded", (msg) => {
    notifier.notify({
      title: "Assignment Added",
      message: "Your Assignment Added from Professor.",
      icon: "../../resources/icon.ico",
      appID: "Assignment Added",
    });
  });
  socket.on("quizAdded", (msg) => {
    notifier.notify({
      title: "Quiz Added",
      message: "Your Quiz Added from Professor.",
      icon: "../../resources/icon.ico",
      appID: "Quiz Added",
    });
  });
});

app.get("/", (req, res) => {
  res.send("Happy");
});
