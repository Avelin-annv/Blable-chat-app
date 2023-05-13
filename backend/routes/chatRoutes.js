const express = require("express");
const authorize = require("../middleware/authorization");
const {
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  accessChat,
  getAllChats,
} = require("../controllers/chatController");

const router = express.Router();

router.route("/").get(authorize, getAllChats).post(authorize, accessChat);
router.route("/groupcreate").post(authorize, createGroupChat);
router.route("/renamegroup").put(authorize, renameGroup);
router.route("/addtogroup").put(authorize, addToGroup);
router.route("/groupremove").put(authorize, removeFromGroup);
module.exports = router;
