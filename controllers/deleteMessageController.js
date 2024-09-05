const pool = require("../db/dbConnection");

const deleteMessageController = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { senderId } = req.body;

    if (!senderId || !messageId)
      return res
        .status(400)
        .json({ error: "Message editing failed due to validation errors" });

    const messageExist = await pool.query(
      `SELECT * FROM messages WHERE id = $1`,
      [messageId]
    );

    if (messageExist.rows.length == 0)
      return res.status(404).json({ error: "Message Not Found" });

    const message = messageExist.rows[0];

    if (message.sender_id != senderId) return res.sendStatus(401);

    await pool.query(`DELETE FROM messages WHERE id=$1`, [messageId]);

    return res.status(200).json({ message: "Message deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = deleteMessageController;
