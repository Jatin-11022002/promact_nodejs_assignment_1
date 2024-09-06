const express = require("express");
const refreshTokenRouter = express.Router();
const verifyRefreshToken = require("../controllers/tokenControllers/verifyRefreshTokenController");

refreshTokenRouter.route("/refresh-token").get(verifyRefreshToken);

module.exports = refreshTokenRouter;
