const express = require("express");

const {
  registerUser,
  authenticateUser,
  getAllUsers,
} = require("../controllers/userController");
const authorize = require("../middleware/authorization");
const router = express.Router();
router.route("/").post(registerUser).get(authorize, getAllUsers);
router.post("/login", authenticateUser);

module.exports = router;
