const pool = require("../../db/dbConnection"); // Import the database connection

// Controller to handle editing a message
const editMessageController = async (req, res) => {
  try {
    // Extract messageId from the request parameters and senderId, content from the request body
    const { messageId } = req.params;
    const { senderId, content } = req.body;

    // Validate that messageId, senderId, and content are provided
    if (!senderId || !content || !messageId) {
      return res
        .status(400)
        .json({ error: "Message editing failed due to validation errors" }); // Return a 400 Bad Request if any parameter is missing
    }

    // Query the database to check if the message exists
    const messageExist = await pool.query(
      `SELECT * FROM messages WHERE id = $1`,
      [messageId]
    );

    // If the message doesn't exist, return a 404 Not Found
    if (messageExist.rows.length == 0) {
      return res.status(404).json({ error: "Message Not Found" });
    }

    // Get the message from the query result
    const message = messageExist.rows[0];

    // Check if the senderId matches the message's sender_id; if not, return a 401 Unauthorized
    if (message.sender_id != senderId) {
      return res.sendStatus(401); // Unauthorized - senderId doesn't match the owner of the message
    }

    // Update the message content in the database
    await pool.query(`UPDATE messages SET content=$1 WHERE id=$2`, [
      content, // New content
      messageId, // Message ID to update
    ]);

    // Return success response with a 200 OK status
    return res.status(200).json({ message: "Message updated Successfully" });
  } catch (error) {
    // Handle any unexpected errors and return a 500 Internal Server Error
    return res.status(500).json({ error: error.message });
  }
};

module.exports = editMessageController; // Export the controller function for use in the router
