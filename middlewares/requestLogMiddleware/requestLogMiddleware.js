require("dotenv").config();
const jwt = require("jsonwebtoken");
const pool = require("../../db/dbConnection");
const { v4: uuidv4 } = require("uuid");

const requestLogMiddleware = async (req, res, next) => {
  const clientIPAddress = req.ip;
  const requestBody = req.body;
  const authHeader = req.headers["authorization"];
  let username = "";

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    const tokenVerification = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      (err, data) => {
        if (!err) {
          username = data.username;
        }
      }
    );
  }
  const logId = uuidv4();

  await pool.query(
    `INSERT into logs(id,request_body,username,ip_address) VALUES($1,$2,$3,$4)`,
    [logId, requestBody, username, clientIPAddress]
  );

  next();
};

module.exports = requestLogMiddleware;
