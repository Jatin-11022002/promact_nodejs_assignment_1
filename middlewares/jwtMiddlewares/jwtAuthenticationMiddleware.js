// Load environment variables from a .env file into process.env
require("dotenv").config();

// Import the jsonwebtoken library for handling JWT authentication
const jwt = require("jsonwebtoken");

// Middleware function to authenticate JWT tokens
const jwtAuthenticationMiddleware = (req, res, next) => {
  try {
    // Retrieve the 'Authorization' header from the incoming request
    const authHeader = req.headers["authorization"];

    // If no 'Authorization' header is present, respond with 401 Unauthorized
    if (!authHeader) return res.sendStatus(401);

    // Extract the token from the 'Authorization' header (format: 'Bearer <token>')
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret key from environment variables
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (error, data) => {
      if (error) {
        // If verification fails, respond with 401 Unauthorized
        return res.sendStatus(401);
      } else {
        // If verification succeeds, proceed to the next middleware or route handler
        next();
      }
    });
  } catch (error) {
    // Handle any unexpected errors and respond with a 500 Internal Server Error
    return res.status(500).json({ error: error.message });
  }
};

// Export the middleware function for use in other parts of the application
module.exports = jwtAuthenticationMiddleware;
