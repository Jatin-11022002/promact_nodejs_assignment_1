const pool = require("../db/dbConnection");

const userListController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: "Invalid Request" });

    const users = await pool.query(
      `SELECT id, name, email FROM users WHERE id!=$1`,
      [userId]
    );

    return res.status(200).json({ users: users.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = userListController;
