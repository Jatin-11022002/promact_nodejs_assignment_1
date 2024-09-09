// Load environment variables from a .env file into process.env
require("dotenv").config();

// Import the Pool class from the 'pg' (PostgreSQL) library for managing database connections
const Pool = require("pg").Pool;

// Create a new instance of the Pool class with database connection details
const pool = new Pool({
  // User name for connecting to the PostgreSQL database
  user: process.env.PSQL_USER,

  // Password for the user
  password: process.env.PSQL_USER_PASSWORD,

  // Host where the PostgreSQL database is located
  host: process.env.PSQL_HOST,

  // Port on which the PostgreSQL database is listening
  port: process.env.PSQL_PORT,

  // Name of the PostgreSQL database to connect to
  database: process.env.PSQL_DATABASE,
});

// Export the pool instance to be used in other parts of the application for database queries
module.exports = pool;
