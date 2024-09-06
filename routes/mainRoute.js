const express = require("express");
const app = express();

const userRoutes = require("./userRoutes");
const refreshTokenRoutes = require("./refreshTokenRoutes");
const messageRouter = require("./messageRoutes");
const logsRouter = require("./logsRoutes");

const jwtAuthenticationMiddleware = require("../middlewares/jwtMiddlewares/jwtAuthenticationMiddleware");

app.use("/users/", userRoutes);
app.use("/token/", refreshTokenRoutes);
app.use("/logs/", jwtAuthenticationMiddleware, logsRouter);
app.use("/messages", jwtAuthenticationMiddleware, messageRouter);

module.exports = app;
