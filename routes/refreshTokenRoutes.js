// Import the Express library to create a new router instance
const express = require("express");

// Create a new router instance for handling refresh token-related routes
const refreshTokenRouter = express.Router();

// Import the controller function for verifying refresh tokens
const verifyRefreshToken = require("../controllers/tokenControllers/verifyRefreshTokenController");

// Define the route for handling refresh token verification
// - GET /refresh-token -> verifyRefreshToken: Handles verification of the refresh token
refreshTokenRouter.route("/refresh-token").get(verifyRefreshToken);

// Export the refreshTokenRouter instance for use in other parts of the application
module.exports = refreshTokenRouter;
