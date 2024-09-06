const pool = require("../../db/dbConnection");
const { v4: uuidv4 } = require("uuid");

const sendMessageController = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content)
      return res
        .status(400)
        .json({ error: "Message sending failed due to validation error" });

    const usersExist = await pool.query(
      `SELECT * FROM users WHERE id IN ($1,$2)`,
      [senderId, receiverId]
    );

    if (usersExist.rows.length != 2)
      return res.status(400).json({ error: "Users Not found" });

    const messageId = uuidv4();

    const message = await pool.query(
      `INSERT into messages(id,sender_id,receiver_id,content) VALUES($1,$2,$3,$4) RETURNING id, sender_id,receiver_id,content,timestamp`,
      [messageId, senderId, receiverId, content]
    );

    return res.status(200).json({ message: message.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = sendMessageController;
