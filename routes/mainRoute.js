const express = require("express");
const app = express();

const userRoutes = require("./userRoutes");
const refreshTokenRoutes = require("./refreshTokenRoutes");
const messageRouter = require("./messageRoutes");
const jwtAuthenticationMiddleware = require("../middlewares/jwtMiddlewares/jwtAuthenticationMiddleware");

app.use("/users/", userRoutes);
app.use("/token/", refreshTokenRoutes);
app.use("/messages", jwtAuthenticationMiddleware, messageRouter);

module.exports = app;
