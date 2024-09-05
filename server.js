require("dotenv").config();
const express = require("express");
const app = express();
const server_port = process.env.SERVER_PORT;
const pool = require("./db/db-config");

const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users/", userRoutes);

app.get("/", async (req, res) => {
  const result = await pool.query(
    "INSERT into users(id,name,email,password) VALUES(1,'ramesh','ad@gmail.com','12');"
  );
  res.json(result);
});

app.listen(server_port, () => {
  console.log(`Server Listening on ${server_port}`);
});
