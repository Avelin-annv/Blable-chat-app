const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const accessChat = asyncHandler(async (req, res) => {
  //create or get a particular chat
  //req-will contain another user's id
  //filter one on one chats based on that.
  const { userId } = req.body;
  if (!userId) {
    console.log("user id is not available in request.");
    res.send(400);
  }
  var chatDetails = Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("lastMessage");
  chatDetails = await User.populate(chatDetails, {
    path: "lastMessage.sender",
    select: "userName email profilePic",
  });
  if (chatDetails.length > 0) {
    res.send(chatDetails[0]);
  } else {
    //create a new one
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChatDetails = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.status(200).send(fullChatDetails);
    } catch (e) {
      console.log("Error creating a new chat:", e.message);
      res.send(400);
    }
  }
});
const getAllChats = asyncHandler(async (req, res) => {
  try {
    await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "lastMessage.sender",
          select: "userName email profilePic",
        });
        res.send(result).status(200);
      });
  } catch (e) {
    console.log("Error fetching chat details", e.message);
    res.status(400);
  }
});
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.chatName) {
    return res.status(400).send({ message: "Please fill in all the fields" });
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: " More than two users can only form a group chat." });
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.chatName,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(fullGroupChat);
  } catch (e) {
    res.status(400).send("Error creating group chat.");
  }
});
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedGroupChat) {
    res.status(400).send("Error updating groupchat");
    throw new Error("chat not found");
  } else {
    res.send(updatedGroupChat);
  }
});
const addToGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  const updatedGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedGroupChat) {
    res.status(400).send("Error adding users");
    throw new Error("Group chat not found");
  } else {
    res.send(updatedGroupChat);
  }
});
const removeFromGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  const updatedGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedGroupChat) {
    res.status(400).send("Error removing users");
    throw new Error("Group chat not found");
  } else {
    res.send(updatedGroupChat);
  }
});
const addChatNotifications = asyncHandler(async (req, res) => {
  // const { userId, chatId } = req.body;
  const { content, chatId } = req.body;
  var newNotif = {
    sender: req.user._id,
    content,
    chat: chatId,
  };
  const updatedChatNotifications = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { notifications: newNotif },
    },
    { new: true }
  );
  //.populate("users", "-password");
  //.populate("groupAdmin", "-password");
  if (!updatedChatNotifications) {
    res.status(400).send("Error occured.");
    throw new Error("Error occured.");
  } else {
    res.send(updatedGroupChat);
  }
});
const removeChatNotifications = asyncHandler(async (req, res) => {
  const { notifId, chatId } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { notifications: notifId },
    },
    { new: true }
  );
  // .populate("users", "-password")
  // .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(400).send("Uncaught error");
    throw new Error("Uncaught error");
  } else {
    res.send(updatedChat);
  }
});
module.exports = {
  accessChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  getAllChats,
  removeChatNotifications,
  addChatNotifications,
};
