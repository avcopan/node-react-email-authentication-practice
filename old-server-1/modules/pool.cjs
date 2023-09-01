const pg = require("pg");

require("dotenv").config();

pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// pool
//   .query("SELECT * FROM users;")
//   .then((result) => result.rows)
//   .then(console.log)
//   .then(console.error);

module.exports = pool;
