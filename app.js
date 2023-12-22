const express = require("express");
const UserRoutes = require("./routes/UserRoutes");
const ChatRoutes = require("./routes/ChatRoutes");
const MsgRoutes = require("./routes/MsgRoutes");
const app = express();
app.use(express.json());

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/chat", ChatRoutes);
app.use("/api/v1/Message", MsgRoutes);
module.exports = app;
