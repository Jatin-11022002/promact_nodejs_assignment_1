const express = require("express");
const app = express();

const userRoutes = require("./userRoutes");
const refreshTokenRoutes = require("./refreshTokenRoutes");

app.use("/users/", userRoutes);
app.use("/token/", refreshTokenRoutes);

module.exports = app;
