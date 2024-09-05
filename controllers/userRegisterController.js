require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../db/dbConnection");
const { v4: uuidv4 } = require("uuid");

const userRegistrationController = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ error: "Registration failed due to validation errors" });
    }

    const checkUserEmail = await pool.query(
      `SELECT * FROM users WHERE email='${email}';`
    );

    if (checkUserEmail.rows.length > 0) {
      return res.status(409).json({
        error: "Registration failed because the email is already registered",
      });
    }

    const userId = uuidv4();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)",
      [userId, name, email, hashedPassword]
    );

    return res.status(200).json({ userId, name, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = userRegistrationController;
