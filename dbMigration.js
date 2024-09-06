require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.PSQL_USER,
  password: process.env.PSQL_USER_PASSWORD,
  host: process.env.PSQL_HOST,
  port: process.env.PSQL_PORT,
  database: process.env.PSQL_DATABASE,
});

(async () => {
  try {
    const usersTable = await pool.query(process.env.DB_USERS_TABLE);

    const messagesTable = await pool.query(process.env.DB_MESSAGES_TABLE);

    const logsTable = await pool.query(process.env.DB_LOGS_TABLE);
    
    
    console.log("Tables Created");
    pool.end();

  } catch (error) {
    console.log(error);
  }
})();
