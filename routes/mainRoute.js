const express = require("express");
const app = express();

const userRoutes = require("./userRoutes");
const refreshTokenRoutes = require("./refreshTokenRoutes");
const messageRouter = require("./messageRoutes");

app.use("/users/", userRoutes);
app.use("/token/", refreshTokenRoutes);
app.use("/messages", messageRouter);

module.exports = app;
