const express = require("express");
const authorize = require("../middleware/authorization");
const {
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  accessChat,
  getAllChats,
  removeChatNotifications,
  addChatNotifications,
} = require("../controllers/chatController");

const router = express.Router();

router.route("/").get(authorize, getAllChats).post(authorize, accessChat);
router.route("/groupcreate").post(authorize, createGroupChat);
router.route("/renamegroup").put(authorize, renameGroup);
router.route("/addtogroup").put(authorize, addToGroup);
router.route("/groupremove").put(authorize, removeFromGroup);
router.route("/addNotification").put(authorize, addChatNotifications);
router.route("/removeNotification").put(authorize, removeChatNotifications);
module.exports = router;
