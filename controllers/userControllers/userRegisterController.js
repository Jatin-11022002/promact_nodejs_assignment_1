require("dotenv").config(); // Load environment variables from the .env file
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const pool = require("../../db/dbConnection"); // Import the database connection
const { v4: uuidv4 } = require("uuid"); // Import UUID for generating unique user IDs

// Controller to handle user registration
const userRegistrationController = async (req, res) => {
  try {
    // Extract email, name, and password from the request body
    const { email, name, password } = req.body;

    // Validate that all required fields are provided
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ error: "Registration failed due to validation errors" }); // Return a 400 Bad Request if any field is missing
    }

    // Check if the email is already registered in the users table
    const checkUserEmail = await pool.query(
      `SELECT * FROM users WHERE email='${email}';`
    );

    // If the email is already registered, return a 409 Conflict
    if (checkUserEmail.rows.length > 0) {
      return res.status(409).json({
        error: "Registration failed because the email is already registered",
      });
    }

    // Generate a unique user ID using UUID
    const userId = uuidv4();

    // Hash the user's password using bcrypt with a salt round
    const hashedPassword = await bcrypt.hash(
      password,
      process.env.BCRYPT_SALT_ROUND
    );

    // Insert the new user into the users table with the hashed password
    const newUser = await pool.query(
      "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)",
      [userId, name, email, hashedPassword]
    );

    // Return the userId, name, and email in the response
    return res.status(200).json({ userId, name, email });
  } catch (error) {
    // Handle any unexpected errors and return a 500 Internal Server Error
    res.status(500).json({ error: error.message });
  }
};

module.exports = userRegistrationController; // Export the controller function for use in the router
