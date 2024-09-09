// Load environment variables from a .env file into process.env
require("dotenv").config();

// Import the Express library to create an Express application instance
const express = require("express");

// Create a new Express application instance
const app = express();

// Retrieve the server port number from environment variables
const serverPort = process.env.SERVER_PORT;

// Import middleware for parsing cookies
const cookieParser = require("cookie-parser");

// Import middleware for logging request details
const requestLoggingMiddleware = require("./middlewares/requestLogMiddleware/requestLogMiddleware");

// Import the main application routes
const routes = require("./routes/mainRoute");

// Trust the proxy headers, useful when deploying behind a proxy (like Nginx)
app.set("trust proxy", true);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data (typically from HTML forms)
app.use(express.urlencoded({ extended: false }));

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Middleware to log request details and route handlers
// - '/api/' is the base path for routing, requestLoggingMiddleware logs details, and routes handle the actual endpoints
app.use("/api/", requestLoggingMiddleware, routes);

// Start the server and listen on the specified port
app.listen(serverPort, () => {
  // Log a message when the server starts successfully
  console.log(`Server Listening on ${serverPort}`);
});
