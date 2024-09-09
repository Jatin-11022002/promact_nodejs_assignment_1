const pool = require("../../db/dbConnection"); // Import the database connection

// Controller to handle retrieving messages between two users with optional sorting and pagination
const getMessagesController = async (req, res) => {
  try {
    // Destructure the senderId, receiverId (userId), before timestamp, count, and sort order from the request body
    let {
      senderId,
      userId: receiverId, // Alias userId as receiverId for clarity
      before, // Optional timestamp to retrieve messages before this time
      count = 20, // Default message limit is 20 if not provided
      sort = "asc", // Default sorting order is ascending if not provided
    } = req.body;

    // Ensure sort is always in lowercase for easier comparison
    sort = sort.toLowerCase();

    // Validate the request parameters: senderId, receiverId, and sort order must be valid
    if (!senderId || !receiverId || (sort != "asc" && sort != "desc")) {
      return res.status(400).json({ error: "Invalid request parameters" }); // Return a 400 Bad Request if validation fails
    }

    // Base query to retrieve messages between the sender and receiver (in either direction)
    let query = `SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)`;

    // Add senderId and receiverId to the query parameters
    let queryParams = [senderId, receiverId];

    // If a 'before' timestamp is provided, add it to the query to fetch messages before this timestamp
    if (before) {
      query += ` AND timestamp < $3`;
      queryParams.push(before); // Add the 'before' timestamp to query parameters
    }

    // Add sorting order (either ascending or descending based on the 'sort' parameter)
    query += ` ORDER BY timestamp ${sort === "desc" ? "DESC" : "ASC"}`;

    // Limit the number of results to the 'count' parameter
    query += ` LIMIT ${count}`;

    // Execute the query with the constructed SQL and query parameters
    const messages = await pool.query(query, queryParams);

    // If no messages are found, return a 404 Not Found
    if (messages.rows.length == 0) {
      return res.status(404).json({ error: "User or conversation not found" });
    }

    // Return the messages with a 200 OK status
    return res.status(200).json({ messages: messages.rows });
  } catch (error) {
    // Handle any unexpected errors and return a 500 Internal Server Error
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getMessagesController; // Export the controller function for use in the router
