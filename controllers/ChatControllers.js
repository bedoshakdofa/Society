const Chat = require("./../Models/chat");
const User = require("./../Models/UserModule");

exports.accessChat = async (req, res, next) => {
    const { UserID } = req.body;

    if (!UserID) {
        return new Error("user ID parameter not sent with request");
    }
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { UserID: { $elemMatch: { $eq: req.user.id } } },
            { UserID: { $elemMatch: { $eq: UserID } } },
        ],
    })
        .populate("UserID", "-Password")
        .populate("latestMsg");

    isChat = await User.populate(isChat, {
        path: "latestMsg.senderId",
        select: "username pic email",
    });
    if (isChat.length > 0) {
        return res.status(200).json(isChat[0]);
    }
    try {
        const createdChat = await Chat.create({
            Chatname: "sender",
            isGroupChat: false,
            UserID: [req.user.id, UserID],
        });
        const FullChat = await Chat.findOne({
            _id: createdChat._id,
        }).populate("UserID", "-Password");
        res.status(200).json(FullChat);
    } catch (error) {
        res.status(400);
    }
};

exports.fetchMsg = async (req, res, next) => {
    let result = await Chat.find({
        UserID: { $elemMatch: { $eq: req.user.id } },
    })
        .populate("UserID", "-Password")
        .populate("groupAdmin", "-Password")
        .populate("latestMsg");

    result = await User.populate(result, {
        path: "latestMsg.senderId",
        select: "username email pic",
    });

    res.status(200).json(result);
};

exports.CreateGroupChat = async (req, res, next) => {
    if (!req.body.name || !req.body.users) {
        return res.status(400).json("plz fill the field");
    }
    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).json("chat must be more than one user");
    }

    users.push(req.user.id);

    const groupchat = await Chat.create({
        Chatname: req.body.name,
        isGroupChat: true,
        groupAdmin: req.user.id,
        UserID: users,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupchat._id })
        .populate("UserID", "-Password")
        .populate("groupAdmin", "-Password");

    res.status(200).json(fullGroupChat);
};

exports.RenameGroup = async (req, res, next) => {
    const { ChatID, Chatname } = req.body;
    if (!(await Chat.findOne({ groupAdmin: req.user.id }))) {
        return res.json("your are not authriezd to do this");
    }
    const UpdatedChat = await Chat.findByIdAndUpdate(
        ChatID,
        { Chatname: Chatname },
        {
            new: true,
        }
    );
    res.status(200).json({
        status: "success",
        data: UpdatedChat,
    });
};

exports.removeFromGroup = async (req, res) => {
    const { ChatID, userID } = req.body;
    if (!(await Chat.findOne({ groupAdmin: req.user.id }))) {
        return res.json("your are not authriezd to do this");
    }
    const removed = await Chat.findByIdAndUpdate(
        ChatID,
        {
            $pull: { UserID: userID },
        },
        {
            new: true,
        }
    );
    res.status(200).json({
        status: "success",
        data: removed,
    });
};

exports.addToGroup = async (req, res) => {
    const { ChatID, userID } = req.body;

    if (!(await Chat.findOne({ groupAdmin: req.user.id }))) {
        return res.json("your are not authriezd to do this");
    }

    const added = await Chat.findByIdAndUpdate(
        ChatID,
        {
            $push: { UserID: userID },
        },
        {
            new: true,
        }
    );
    res.status(200).json({
        status: "success",
        data: added,
    });
};
