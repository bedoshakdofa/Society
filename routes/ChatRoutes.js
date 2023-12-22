const express = require("express");
const ChatControllers = require("./../controllers/ChatControllers");
const authControllers = require("./../controllers/authControllers");
const router = express.Router();

router
    .route("/")
    .post(authControllers.protect, ChatControllers.accessChat)
    .get(authControllers.protect, ChatControllers.fetchMsg);
router.post("/group", authControllers.protect, ChatControllers.CreateGroupChat);
router.patch(
    "/RenameChat",
    authControllers.protect,
    ChatControllers.RenameGroup
);
router.patch(
    "/Remove",
    authControllers.protect,
    ChatControllers.removeFromGroup
);
router.patch("/addOne", authControllers.protect, ChatControllers.addToGroup);
module.exports = router;
