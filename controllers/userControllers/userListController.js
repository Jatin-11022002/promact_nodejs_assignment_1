const pool = require("../../db/dbConnection"); // Import the database connection

// Controller to retrieve a list of users excluding the current user
const userListController = async (req, res) => {
  try {
    // Extract userId from the request body
    const { userId } = req.body;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({ error: "Invalid Request" }); // Return a 400 Bad Request if userId is missing
    }

    // Query the database to get a list of users excluding the current user (userId)
    const users = await pool.query(
      `SELECT id, name, email FROM users WHERE id != $1`, // Exclude the user with the provided userId
      [userId]
    );

    // Return the list of users with a 200 OK status
    return res.status(200).json({ users: users.rows });
  } catch (error) {
    // Handle any unexpected errors and return a 500 Internal Server Error
    return res.status(500).json({ error: error.message });
  }
};

module.exports = userListController; // Export the controller function for use in the router
