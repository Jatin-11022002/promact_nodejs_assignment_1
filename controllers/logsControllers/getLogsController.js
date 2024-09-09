const pool = require("../../db/dbConnection"); // Import the database connection from the dbConnection module

// Controller to handle retrieving logs between specified timestamps
const getLogsController = async (req, res) => {
  try {
    // Destructure endTime and startTime from the request body
    let { endTime, startTime } = req.body;

    // Validate startTime and endTime - check if they are valid ISO date strings
    if (
      (startTime && isNaN(Date.parse(startTime))) || // If startTime is provided but is invalid
      (endTime && isNaN(Date.parse(endTime))) // If endTime is provided but is invalid
    ) {
      return res.status(400).json({ error: "Invalid request parameters" }); // Return a 400 Bad Request if any date is invalid
    }

    // Set default startTime to 5 minutes before the current time if not provided
    if (!startTime) {
      const currentTime = new Date(); // Get current time
      const timeBefore5min = new Date(currentTime.getTime() - 5 * 1000 * 60); // Subtract 5 minutes
      startTime = timeBefore5min.toISOString(); // Convert to ISO format
    }

    // Set default endTime to the current time if not provided
    if (!endTime) {
      const currentTime = new Date().getTime(); // Get current time in milliseconds
      const currentTimeUTC = new Date(currentTime).toISOString(); // Convert to ISO format
      endTime = currentTimeUTC;
    }

    // Ensure that startTime is before endTime, otherwise return an error
    if (new Date(startTime) > new Date(endTime)) {
      return res.status(400).json({ error: "Invalid request parameters" }); // Return a 400 Bad Request if startTime is after endTime
    }

    // Query the logs table for logs between startTime and endTime
    let logs = await pool.query(
      `SELECT * FROM logs WHERE timestamp >= $1 AND timestamp <= $2`,
      [startTime, endTime]
    );

    // If no logs are found, return a 404 Not Found
    if (logs.rows.length == 0)
      return res.status(404).json({ error: "Not Found" });

    // Return the retrieved logs in the response with a 200 OK status
    return res.status(200).json({ logs: logs.rows });
  } catch (error) {
    // Return a 500 Internal Server Error if something goes wrong in the try block
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getLogsController; // Export the getLogsController function for use in the router
