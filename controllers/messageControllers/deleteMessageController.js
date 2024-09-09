const pool = require("../../db/dbConnection"); // Import the database connection

// Controller to handle deleting a message
const deleteMessageController = async (req, res) => {
  try {
    // Extract messageId from request parameters and senderId from the request body
    const { messageId } = req.params;
    const { senderId } = req.body;

    // Validate that both messageId and senderId are provided
    if (!senderId || !messageId) {
      return res
        .status(400)
        .json({ error: "Message editing failed due to validation errors" }); // Return a 400 Bad Request if either is missing
    }

    // Query the database to check if the message exists
    const messageExist = await pool.query(
      `SELECT * FROM messages WHERE id = $1`,
      [messageId]
    );

    // If no message is found, return a 404 Not Found error
    if (messageExist.rows.length == 0) {
      return res.status(404).json({ error: "Message Not Found" });
    }

    // Get the first row (the message) from the query result
    const message = messageExist.rows[0];

    // Check if the senderId matches the message's sender_id; if not, return a 401 Unauthorized
    if (message.sender_id != senderId) {
      return res.sendStatus(401); // Unauthorized - senderId doesn't match the owner of the message
    }

    // Delete the message from the database if senderId is valid
    await pool.query(`DELETE FROM messages WHERE id=$1`, [messageId]);

    // Return success response with a 200 OK status
    return res.status(200).json({ message: "Message deleted Successfully" });
  } catch (error) {
    // Handle any unexpected errors and return a 500 Internal Server Error
    return res.status(500).json({ error: error.message });
  }
};

module.exports = deleteMessageController; // Export the controller function for use in the router
