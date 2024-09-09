// Import the Express library to create an Express router
const express = require("express");

// Create a new router instance for handling routes related to logs
const logsRouter = express.Router();

// Import the controller function for handling GET requests to fetch logs
const getLogsController = require("../controllers/logsControllers/getLogsController");

// Define the route for handling GET requests to the root path ('/')
// and link it to the getLogsController function
logsRouter.route("/").get(getLogsController);

// Export the logsRouter instance for use in other parts of the application
module.exports = logsRouter;
