const Message = require("./../Models/message");
const User = require("./../Models/UserModule");
const Chat = require("./../Models/chat");

exports.sendMessage = async (req, res) => {
    const { content, ChatID } = req.body;

    if (!content || !ChatID) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    try {
        let message = await Message.create({
            senderId: req.user._id,
            content: content,
            ChatID: ChatID,
        });
        message = await message.populate("senderId").populate("ChatID");
        message = await User.populate(message, {
            path: "ChatID.UserID",
            select: "username pic email",
        });

        await Chat.findByIdAndUpdate(ChatID, {
            latestMsg: message,
        });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

exports.allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ ChatID: req.params.chatId })
            .populate("senderId", "username pic email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};
