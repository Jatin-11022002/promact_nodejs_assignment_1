const express = require("express");
const messageRouter = express.Router();
const sendMessageController = require("../controllers/sendMessageController");
const editMessageController = require("../controllers/editMessageController");
const deleteMessageController = require("../controllers/deleteMessageController");

messageRouter.route("/").post(sendMessageController);
messageRouter.route("/:messageId").post(editMessageController);
messageRouter.route("/:messageId").delete(deleteMessageController);

module.exports = messageRouter;
