require("dotenv").config();
const jwt = require("jsonwebtoken");
const pool = require("../../db/dbConnection");

const verifyRefreshTokenController = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt)
      return res.sendStatus(401).json({ error: "Unauthorized access" });

    const token = cookies.jwt;

    const user = await pool.query(
      `SELECT * FROM users where refresh_token = $1`,
      [token]
    );

    if (user.rows.length == 0)
      return res.sendStatus(401).json({ error: "Unauthorized access" });

    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (error, data) => {
      if (error)
        return res.sendStatus(401).json({ error: "Unauthorized access" });

      const newAccessToken = jwt.sign(
        { email: user.rows[0].email },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      return res.json({ token: newAccessToken });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = verifyRefreshTokenController;
