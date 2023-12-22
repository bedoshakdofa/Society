const express = require("express");
const router = express.Router();
const MsgControllers = require("./../controllers/MsgControllers");
const authControllers = require("./../controllers/authControllers");

router.post("/", authControllers.protect, MsgControllers.sendMessage);
router.post("/messages", authControllers.protect, MsgControllers.allMessages);

module.exports = router;
