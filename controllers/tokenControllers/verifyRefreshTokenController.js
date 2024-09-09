// Load environment variables from a .env file into process.env
require("dotenv").config();

// Import the jsonwebtoken library for handling JWT authentication
const jwt = require("jsonwebtoken");

// Import the database connection pool
const pool = require("../../db/dbConnection");

// Controller function to verify and refresh JWT tokens
const verifyRefreshTokenController = async (req, res) => {
  try {
    // Retrieve cookies from the request
    const cookies = req.cookies;

    // Check if the 'jwt' cookie is present
    if (!cookies?.jwt) {
      // Respond with 401 Unauthorized if cookie is missing
      return res.sendStatus(401).json({ error: "Unauthorized access" });
    }

    // Extract the refresh token from the cookie
    const token = cookies.jwt;

    // Query the database to find a user with the provided refresh token
    const user = await pool.query(
      `SELECT * FROM users WHERE refresh_token = $1`,
      [token]
    );

    // Check if a user was found with the provided token
    if (user.rows.length === 0) {
      // Respond with 401 Unauthorized if no user is found
      return res.sendStatus(401).json({ error: "Unauthorized access" });
    }

    // Verify the refresh token using the secret key from environment variables
    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (error, data) => {
      if (error) {
        // Respond with 401 Unauthorized if token verification fails
        return res.sendStatus(401).json({ error: "Unauthorized access" });
      }

      // Create a new access token using the user's email from the token payload
      const newAccessToken = jwt.sign(
        { email: user.rows[0].email },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" } // Access token expires in 5 minutes
      );

      // Respond with the new access token
      return res.json({ token: newAccessToken });
    });
  } catch (error) {
    // Handle any unexpected errors and respond with a 500 Internal Server Error
    return res.status(500).json({ error: error.message });
  }
};

// Export the controller function for use in other parts of the application
module.exports = verifyRefreshTokenController;
