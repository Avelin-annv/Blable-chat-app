const express = require("express");
const dotenv = require("dotenv");

const connectToDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandling");

dotenv.config();
connectToDB();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Api started !!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);
const server = app.listen(port, console.log(`Server started at${port}`));
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("Socket IO initialisd");
  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connected");
  });
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log("user joined chat", chatId);
  });
  socket.on("new message", (newMessage) => {
    var newMsgChat = newMessage.chat;
    if (!newMsgChat.users) {
      return console.log("Users are not defined.");
    }
    newMsgChat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessage);
    });
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stopped typing", (room) => {
    socket.in(room).emit("stopped typing");
  });
  // socket.off("setup", (userData) => {
  //   console.log("socket DISCONNECTED.");
  //   socket.leave(userData._id);
  // });
});
