const mongoose = require("mongoose");

const msgSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        tirm: true,
    },
    ChatID: {
        type: mongoose.Types.ObjectId,
        ref: "chat",
    },
    Readby: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    timestamps: true,
});

const message = mongoose.model("message", msgSchema);

module.exports = message;
