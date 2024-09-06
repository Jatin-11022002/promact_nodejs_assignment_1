const pool = require("../../db/dbConnection");

const getMessagesController = async (req, res) => {
  try {
    let {
      senderId,
      userId: receiverId,
      before,
      count = 20,
      sort = "asc",
    } = req.body;

    sort = sort.toLowerCase();

    if (!senderId || !receiverId || (sort != "asc" && sort != "desc"))
      return res.status(400).json({ error: "Invalid request parameters" });

    let query = `SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)`;

    let queryParams = [senderId, receiverId];

    if (before) {
      query += ` AND timestamp < $3`;
      queryParams.push(before);
    }

    query += ` ORDER BY timestamp ${sort === "desc" ? "DESC" : "ASC"}`;

    query += ` LIMIT ${count}`;

    const messages = await pool.query(query, queryParams);

    return res.status(200).json({ messages: messages.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getMessagesController;
