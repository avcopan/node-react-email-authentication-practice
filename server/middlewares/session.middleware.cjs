// No changes should be required in this file
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("../modules/pool.cjs");

// Create the PG session store
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
