const express = require("express");
const userRouter = express.Router();
const {
  userRegistration,
  userLogin,
} = require("../controllers/userController");

userRouter.route("/register").post(userRegistration);
userRouter.route("/login").post(userLogin);

module.exports = userRouter;
