const pool = require("../../db/dbConnection"); // Import the database connection

// Controller to handle user logout and clear the refresh token
const userLogoutController = async (req, res) => {
  try {
    // Check if the JWT cookie is present
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      // If no JWT cookie is found, send a 204 No Content response (no action needed)
      return res.sendStatus(204); // 204: No Content
    }

    const token = cookies.jwt; // Extract the JWT token from the cookies

    // Clear the JWT cookie on the client side by setting the cookie's expiration to a past time
    res.clearCookie("jwt", {
      httpOnly: true, // HTTP-only flag ensures that the cookie is not accessible via client-side scripts
      maxAge: 24 * 60 * 60 * 1000, // Optional: Define the maximum age (1 day) in case you want to retain it for the future
    });

    // Remove the refresh token from the user's record in the database
    await pool.query(
      "UPDATE users SET refresh_token = NULL WHERE refresh_token = $1", // Set the refresh token to NULL for the user
      [token] // Use the refresh token stored in the cookies to find the user
    );

    // Send a response indicating the user has been logged out
    return res.status(200).json({ message: "User Logged Out" });
  } catch (error) {
    // Handle any unexpected errors and return a 500 Internal Server Error
    res.status(500).json({ error: error.message });
  }
};

module.exports = userLogoutController; // Export the controller function for use in the router
