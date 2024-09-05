require("dotenv").config();
const jwt = require("jsonwebtoken");
const pool = require("../db/db-config");
const bcrypt = require("bcrypt");

const userLoginController = async (req, res) => {
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
          { expiresIn: "5m" }
        );

        const userRefreshToken = jwt.sign(
          { email },
          process.env.JWT_REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        await pool.query(
          "UPDATE users SET refresh_token = $1 WHERE email = $2",
          [userRefreshToken, user.rows[0].email]
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

module.exports = userLoginController;
