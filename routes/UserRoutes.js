const express = require("express");
const Router = express.Router();
const authControllers = require("./../controllers/authControllers");
const UserControllers = require("./../controllers/UserControllers");

Router.post("/signup", authControllers.signup);
Router.post("/login", authControllers.login);
Router.get("/searchUser", authControllers.protect, UserControllers.SearchUser);
Router.post("/test", authControllers.test);

module.exports = Router;
