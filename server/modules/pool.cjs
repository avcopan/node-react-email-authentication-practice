/**
 * Establish connection to Postgres DB via PG pool
 */
require("dotenv").config();

const pg = require("pg");
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// pool
//   .query('SELECT * FROM "user";')
//   .then((result) => result.rows)
//   .then(console.log)
//   .catch(console.error);

module.exports = pool;
