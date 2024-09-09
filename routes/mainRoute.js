// Import the Express library to create an Express application
const express = require("express");

// Create a new Express application instance
const app = express();

// Import route handlers for different parts of the application
const userRoutes = require("./userRoutes");
const refreshTokenRoutes = require("./refreshTokenRoutes");
const messageRouter = require("./messageRoutes");

// Import middleware for JWT authentication
const jwtAuthenticationMiddleware = require("../middlewares/jwtMiddlewares/jwtAuthenticationMiddleware");

// Set up routing for user-related endpoints
// Requests to '/users/' will be handled by userRoutes
app.use("/users/", userRoutes);

// Set up routing for token-related endpoints
// Requests to '/token/' will be handled by refreshTokenRoutes
app.use("/token/", refreshTokenRoutes);

// Set up routing for message-related endpoints
// Requests to '/messages/' will be handled by messageRouter
// JWT authentication middleware is applied to ensure that only authenticated users can access these routes
app.use("/messages/", jwtAuthenticationMiddleware, messageRouter);

// Export the Express application instance for use in other parts of the application
module.exports = app;
