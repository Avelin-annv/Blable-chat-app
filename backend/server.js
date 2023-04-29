const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/dummyData");

const app = express();
dotenv.config();
const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Api started !!");
});

app.get("/chats", (req, res) => {
  res.send(chats);
});
app.get("/chat/:id", (req, res) => {
  const selectedChat = chats.find((chat) => chat._id === req.params.id);
  res.send(selectedChat);
});
app.listen(port, console.log(`Server started at${port}`));
