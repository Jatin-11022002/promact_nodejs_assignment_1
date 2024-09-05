const express = require("express");
const userRouter = express.Router();
const userRegisterController = require("../controllers/userRegisterController");
const userLoginController = require("../controllers/userLoginController");
const userLogoutController = require("../controllers/userLogoutController");
const userListController = require("../controllers/userListController");

const jwtAuthenticationMiddleware = require("../middlewares/jwtAuthenticationMiddleware");

userRouter.route("/register").post(userRegisterController);
userRouter.route("/login").post(userLoginController);
userRouter.route("/list").get(jwtAuthenticationMiddleware, userListController);
userRouter.route("/logout").get(userLogoutController);

module.exports = userRouter;
