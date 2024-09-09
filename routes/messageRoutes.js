// Import the Express library to create a new router instance
const express = require("express");

// Create a new router instance for handling message-related routes
const messageRouter = express.Router();

// Import controller functions for handling different message operations
const sendMessageController = require("../controllers/messageControllers/sendMessageController");
const editMessageController = require("../controllers/messageControllers/editMessageController");
const deleteMessageController = require("../controllers/messageControllers/deleteMessageController");
const getMessagesController = require("../controllers/messageControllers/getMessagesController");

// Define routes for handling messages

// Route for creating a new message (POST request) and retrieving messages (GET request)
// - POST /messages/ -> sendMessageController: Handles creating a new message
// - GET /messages/ -> getMessagesController: Handles retrieving all messages
messageRouter.route("/").post(sendMessageController).get(getMessagesController);

// Route for handling specific message operations by message ID

// Route for updating (PUT request) and deleting (DELETE request) a specific message
// - PUT /messages/:messageId -> editMessageController: Handles updating a message identified by messageId
// - DELETE /messages/:messageId -> deleteMessageController: Handles deleting a message identified by messageId
messageRouter
  .route("/:messageId")
  .put(editMessageController)
  .delete(deleteMessageController);

// Export the messageRouter instance for use in other parts of the application
module.exports = messageRouter;
