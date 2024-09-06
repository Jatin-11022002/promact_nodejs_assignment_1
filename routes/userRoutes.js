const express = require("express");
const userRouter = express.Router();
const userRegisterController = require("../controllers/userControllers/userRegisterController");
const userLoginController = require("../controllers/userControllers/userLoginController");
const userLogoutController = require("../controllers/userControllers/userLogoutController");
const userListController = require("../controllers/userControllers/userListController");

const jwtAuthenticationMiddleware = require("../middlewares/jwtMiddlewares/jwtAuthenticationMiddleware");

userRouter.route("/register").post(userRegisterController);
userRouter.route("/login").post(userLoginController);
userRouter.route("/list").get(jwtAuthenticationMiddleware, userListController);
userRouter.route("/logout").get(userLogoutController);

module.exports = userRouter;
