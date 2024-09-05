const express = require("express");
const refreshTokenRouter = express.Router();
const verifyRefreshToken = require("../controllers/verifyRefreshTokenController");

refreshTokenRouter.route("/refresh-token").get(verifyRefreshToken);

module.exports = refreshTokenRouter;
