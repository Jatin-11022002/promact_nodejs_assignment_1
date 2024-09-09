// Load environment variables from a .env file into process.env
require("dotenv").config();

// Import the jsonwebtoken library for handling JWT authentication
const jwt = require("jsonwebtoken");

// Import the database connection pool
const pool = require("../../db/dbConnection");

// Import uuid library to generate unique identifiers
const { v4: uuidv4 } = require("uuid");

// Middleware function to log request details into the database
const requestLogMiddleware = async (req, res, next) => {
  // Retrieve client IP address from the request
  const clientIPAddress = req.ip;

  // Retrieve the request body
  const requestBody = req.body;

  // Retrieve the 'Authorization' header from the incoming request
  const authHeader = req.headers["authorization"];
  let username = "";

  // If 'Authorization' header is present, verify the JWT token
  if (authHeader) {
    // Extract the token from the 'Authorization' header (format: 'Bearer <token>')
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret key from environment variables
    const tokenVerification = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      (err, data) => {
        if (!err) {
          // If verification succeeds, extract the username from the token payload
          username = data.username;
        }
      }
    );
  }

  // Generate a unique identifier for the log entry
  const logId = uuidv4();

  // Insert log details into the database
  await pool.query(
    `INSERT INTO logs(id, request_body, username, ip_address) VALUES($1, $2, $3, $4)`,
    [logId, requestBody, username, clientIPAddress]
  );

  // Proceed to the next middleware or route handler
  next();
};

// Export the middleware function for use in other parts of the application
module.exports = requestLogMiddleware;
