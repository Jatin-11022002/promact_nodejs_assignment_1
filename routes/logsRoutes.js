const express = require("express");
const logsRouter = express.Router();
const getLogsController=require('../controllers/logsControllers/getLogsController')

logsRouter.route("/").get(getLogsController);

module.exports = logsRouter;
