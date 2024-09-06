require("dotenv").config();
const express = require("express");
const app = express();
const serverPort = process.env.SERVER_PORT;
const cookieParser = require("cookie-parser");
const requestLoggingMiddleware = require("./middlewares/requestLogMiddleware/requestLogMiddleware");

const routes = require("./routes/mainRoute");

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/", requestLoggingMiddleware, routes);

app.listen(serverPort, () => {
  console.log(`Server Listening on ${serverPort}`);
});
