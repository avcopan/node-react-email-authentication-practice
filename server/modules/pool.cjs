/* the only line you likely need to change is

 database: 'prime_app',

 change `prime_app` to the name of your database, and you should be all set!
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
