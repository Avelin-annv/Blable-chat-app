const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  var msgFormData = {
    sender: req.user._id,
    content,
    chat: chatId,
  };
  try {
    var message = await Message.create(msgFormData);

    message = await message.populate("sender", "userName profilePic");

    message = await message.populate({
      path: "chat",
      populate: { path: "lastMessage users" },
    });
    console.log("message psoted", message);
    message = await User.populate(message, {
      path: "chat.users",
      select: "userName email profilePic",
    });
    console.log("message psoted", message);
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message,
    });
    res.json(message);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});
const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "userName email pic")
      .populate({
        path: "chat",
        populate: { path: "lastMessage users" },
      });
    res.json(messages);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});
module.exports = { sendMessage, getAllMessages };
