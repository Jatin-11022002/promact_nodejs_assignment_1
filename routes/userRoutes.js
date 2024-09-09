// Import the Express library to create a new router instance
const express = require("express");

// Create a new router instance for handling user-related routes
const userRouter = express.Router();

// Import controller functions for handling different user operations
const userRegisterController = require("../controllers/userControllers/userRegisterController");
const userLoginController = require("../controllers/userControllers/userLoginController");
const userLogoutController = require("../controllers/userControllers/userLogoutController");
const userListController = require("../controllers/userControllers/userListController");

// Import middleware for JWT authentication
const jwtAuthenticationMiddleware = require("../middlewares/jwtMiddlewares/jwtAuthenticationMiddleware");

// Define routes for user operations

// Route for user registration (POST request)
// - POST /register -> userRegisterController: Handles user registration
userRouter.route("/register").post(userRegisterController);

// Route for user login (POST request)
// - POST /login -> userLoginController: Handles user login
userRouter.route("/login").post(userLoginController);

// Route for retrieving a list of users (GET request)
// - GET / -> userListController: Handles retrieving the list of users
//   This route is protected by JWT authentication middleware
userRouter.route("/").get(jwtAuthenticationMiddleware, userListController);

// Route for user logout (POST request)
// - POST /logout -> userLogoutController: Handles user logout
userRouter.route("/logout").post(userLogoutController);

// Export the userRouter instance for use in other parts of the application
module.exports = userRouter;
