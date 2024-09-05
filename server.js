require("dotenv").config();
const express = require("express");
const app = express();
const serverPort = process.env.SERVER_PORT;
const cookieParser = require("cookie-parser");

const routes = require("./routes/mainRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/", routes);

app.listen(serverPort, () => {
  console.log(`Server Listening on ${serverPort}`);
});
