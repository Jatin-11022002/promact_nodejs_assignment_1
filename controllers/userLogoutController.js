const pool = require("../db/dbConnection");

const userLogoutController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const token = cookies.jwt;

    res.clearCookie("jwt", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    await pool.query(
      "UPDATE users SET refresh_token = NULL WHERE refresh_token = $1",
      [token]
    );

    return res.status(200).json({})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = userLogoutController;
