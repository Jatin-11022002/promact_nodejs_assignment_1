require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtAuthentication = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader)
      return res.sendStatus(401).json({ error: "Unauthorized access" });

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (error, data) => {
      if (error) return res.sendStatus(401).json({ error: "Unauthorized access" });
      else next();
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { jwtAuthentication };
