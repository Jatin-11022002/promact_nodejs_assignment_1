require("dotenv").config();
const express = require("express");
const app = express();
const serverPort = process.env.SERVER_PORT;
const pool = require("./db/db-config");
const cookieParser = require("cookie-parser");

const routes = require("./routes/mainRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/", routes);

app.get("/", async (req, res) => {
  const result = await pool.query(
    "INSERT into users(id,name,email,password) VALUES(1,'ramesh','ad@gmail.com','12');"
  );
  res.json(result);
});

app.listen(serverPort, () => {
  console.log(`Server Listening on ${serverPort}`);
});
