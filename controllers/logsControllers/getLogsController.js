const pool = require("../../db/dbConnection");

const getLogsController = async (req, res) => {
  try {
    let { endTime, startTime } = req.body;

    if (
      (startTime && isNaN(Date.parse(startTime))) ||
      (endTime && isNaN(Date.parse(endTime)))
    ) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    if (!startTime) {
      const currentTime = new Date();
      const timeBefore5min = new Date(currentTime.getTime() - 5 * 1000 * 60);
      startTime = timeBefore5min.toISOString();
    }

    if (!endTime) {
      const currentTime = new Date().getTime();
      const currentTimeUTC = new Date(currentTime).toISOString();
      endTime = currentTimeUTC;
    }

    if (new Date(startTime) > new Date(endTime)) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    let logs = await pool.query(
      `SELECT * FROM logs WHERE timestamp >= $1 AND timestamp <= $2`,
      [startTime, endTime]
    );

    if (logs.rows.length == 0)
      return res.status(404).json({ error: "Not Found" });

    return res.status(200).json({ logs: logs.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getLogsController;
