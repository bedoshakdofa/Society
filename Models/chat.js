const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
    Chatname: {
        type: String,
    },
    UserID: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    latestMsg: {
        type: mongoose.Types.ObjectId,
        ref: "message",
    },
    groupAdmin: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    timestamps:true,
});

const Chat = mongoose.model("chat", ChatSchema);

module.exports = Chat;
