/**
 * Global middleware for handling cookie sessions
 * 
 * Uses express-session and connect-pg-simple to store session information in the
 * database.
 * 
 * Note: The "session" table in database.sql must be created before this will work!
 * 
 * Documentation: https://github.com/voxpelli/node-connect-pg-simple#usage
 */
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("../modules/pool.cjs");

// Create the PG session store, assuming that the "session" table exists in the database
const sessionStore = new pgSession({
  pool: pool,
  tableName: "session",
});

module.exports = session({
  secret: process.env.SERVER_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 day (in milliseconds)
  },
});
