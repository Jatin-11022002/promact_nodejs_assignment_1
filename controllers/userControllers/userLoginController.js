require("dotenv").config(); // Load environment variables from the .env file
const jwt = require("jsonwebtoken"); // Import JSON Web Token for generating access and refresh tokens
const pool = require("../../db/dbConnection"); // Import the database connection
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing and comparison

// Controller to handle user login and token generation
const userLoginController = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Login failed due to validation errors" }); // Return a 400 Bad Request if validation fails
    }

    // Query the database to check if a user exists with the provided email
    const user = await pool.query("SELECT * FROM users where email=$1;", [
      email,
    ]);

    // Check if the user exists
    if (user.rows.length > 0) {
      // Compare the provided password with the stored hashed password
      const checkPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );

      // If the password matches, proceed with token generation
      if (checkPassword) {
        const username = user.rows[0].name; // Get the user's name from the database

        // Generate an access token (short-lived, 5 minutes expiry)
        const userAccessToken = jwt.sign(
          { username }, // Payload containing the username
          process.env.JWT_ACCESS_TOKEN_SECRET, // Secret key for signing the token
          { expiresIn: "5m" } // Token expires in 5 minutes
        );

        // Generate a refresh token (longer-lived, 1 day expiry)
        const userRefreshToken = jwt.sign(
          { username }, // Payload containing the username
          process.env.JWT_REFRESH_TOKEN_SECRET, // Secret key for the refresh token
          { expiresIn: "1d" } // Refresh token expires in 1 day
        );

        // Store the refresh token in the database for the user
        await pool.query(
          "UPDATE users SET refresh_token = $1 WHERE email = $2",
          [userRefreshToken, user.rows[0].email]
        );

        // Set the refresh token in an HTTP-only cookie (cannot be accessed by JavaScript)
        res.cookie("jwt", userRefreshToken, {
          httpOnly: true, // Prevents client-side scripts from accessing the cookie
          maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
        });

        // Respond with the access token and the user's profile information
        return res
          .status(200)
          .json({ token: userAccessToken, profile: user.rows[0] });
      } else {
        // If the password is incorrect, return a 401 Unauthorized
        return res
          .status(401)
          .json({ error: "Login failed due to incorrect credential" });
      }
    } else {
      // If no user is found with the provided email, return a 401 Unauthorized
      return res
        .status(401)
        .json({ error: "Login failed due to incorrect credential" });
    }
  } catch (error) {
    // Handle any unexpected errors and return a 500 Internal Server Error
    res.status(500).json({ error: error.message });
  }
};

module.exports = userLoginController; // Export the controller function for use in the router
