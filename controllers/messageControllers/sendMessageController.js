const pool = require("../../db/dbConnection"); // Import the database connection
const { v4: uuidv4 } = require("uuid"); // Import the UUID library for generating unique IDs

// Controller to handle sending a message between users
const sendMessageController = async (req, res) => {
  try {
    // Destructure senderId, receiverId, and content from the request body
    const { senderId, receiverId, content } = req.body;

    // Validate that senderId, receiverId, and content are provided
    if (!senderId || !receiverId || !content) {
      return res
        .status(400)
        .json({ error: "Message sending failed due to validation error" }); // Return a 400 Bad Request if validation fails
    }

    // Check if both sender and receiver exist in the users table
    const usersExist = await pool.query(
      `SELECT * FROM users WHERE id IN ($1,$2)`,
      [senderId, receiverId]
    );

    // If both users are not found, return an error
    if (usersExist.rows.length != 2) {
      return res.status(400).json({ error: "Users Not found" }); // Return a 400 Bad Request if either user does not exist
    }

    // Generate a new UUID for the message
    const messageId = uuidv4();

    // Insert the new message into the messages table
    const message = await pool.query(
      `INSERT into messages(id, sender_id, receiver_id, content) 
      VALUES($1, $2, $3, $4) 
      RETURNING id, sender_id, receiver_id, content, timestamp`, // Return the message details after insertion
      [messageId, senderId, receiverId, content]
    );

    // Return the newly created message with a 200 OK status
    return res.status(200).json({ message: message.rows[0] });
  } catch (error) {
    // Handle any unexpected errors and return a 500 Internal Server Error
    return res.status(500).json({ error: error.message });
  }
};

module.exports = sendMessageController; // Export the controller function for use in the router
