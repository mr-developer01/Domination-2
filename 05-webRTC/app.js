const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const indexRouter = require("./routes");

const server = http.createServer(app);
const io = socketIO(server);

let waitingusers = [];
let rooms = {};

io.on("connection", (socket) => {
  socket.on("joinroom", () => {
    if (waitingusers.length > 0) {
      let partner = waitingusers.shift();
      const roomname = `${socket.id}-${partner.id}`;
      socket.join(roomname);
      partner.join(roomname);

      io.to(roomname).emit("joined", roomname)
    } else {
      waitingusers.push(socket);
    }
  });

  socket.on("message", (data) => {
    socket.broadcast.to(data.room).emit("message", data.message)
  })

  socket.on("disconnect", () => {
    let index = waitingusers.findIndex((waitingusers) => waitingusers.id === socket.id)
    waitingusers.splice(index, 1)
  })
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

server.listen(3000);
