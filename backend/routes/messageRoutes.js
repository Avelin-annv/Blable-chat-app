const express = require("express");
const authorize = require("../middleware/authorization");
const {
  sendMessage,
  getAllMessages,
} = require("../controllers/messageController");
const router = express.Router();
router.route("/").post(authorize, sendMessage);
router.route("/:chatId").get(authorize, getAllMessages);

module.exports = router;
