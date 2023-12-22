const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const db = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("database is connected succssfully");
    });

const server = app.listen(process.env.PORT, () => {
    console.log(`listing to server on port ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
    pingTimeout: 6000,
});

io.on("connection", (socket) => {
    socket.on("setup", (userdata) => {
        socket.join(userdata._id);
        socket.emit("connected");
    });

    socket.on("join chat", (RoomId) => {
        socket.join(RoomId);
    });

    socket.on("new Message", (newMsg) => {
        let chat = newMsg.chat;
        chat.UserID.map((user) => {
            if (user.id === newMsg.senderID.id) return;
            socket.in(user.id).emit("message recive", newMsg);
        });
    });

    socket.on("disconnect", () => {
        socket.leave(socket.id);
    });
});
