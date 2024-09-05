require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../db/db-config");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const userRegistration = async (req, res) => {
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

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ error: "Login failed due to validation errors" });

    const user = await pool.query("SELECT * FROM users where email=$1;", [
      email,
    ]);

    if (user.rows.length > 0) {
      const checkPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );

      if (checkPassword) {
        const userAccessToken = jwt.sign(
          { email },
          process.env.JWT_ACCESS_TOKEN_SECRET,
          { expiresIn: "120s" }
        );

        const userRefreshToken = jwt.sign(
          { email },
          process.env.JWT_REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        res.cookie("jwt", userRefreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res
          .status(200)
          .json({ token: userAccessToken, profile: user.rows[0] });
      } else {
        return res
          .status(401)
          .json({ error: "Login failed due to incorrect credential" });
      }
    } else {
      return res
        .status(401)
        .json({ error: "Login failed due to incorrect credential" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { userRegistration, userLogin };
