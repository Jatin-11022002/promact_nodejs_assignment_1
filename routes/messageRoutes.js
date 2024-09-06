const express = require("express");
const messageRouter = express.Router();
const sendMessageController = require("../controllers/messageControllers/sendMessageController");
const editMessageController = require("../controllers/messageControllers/editMessageController");
const deleteMessageController = require("../controllers/messageControllers/deleteMessageController");
const getMessagesController = require("../controllers/messageControllers/getMessagesController");

messageRouter.route("/").post(sendMessageController).get(getMessagesController);
messageRouter.route("/:messageId").post(editMessageController);
messageRouter.route("/:messageId").delete(deleteMessageController);

module.exports = messageRouter;
