// External module imports
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const port = process.env.PORT || 8000;

require("dotenv").config();

// Internal module imports
const pool = require("./modules/pool.cjs");
const authRouter = require("./routes/auth.router.cjs");

// Create the app
const app = express();

// Create the PG session store
const sessionStore = new pgSession({
  pool: pool,
  tableName: "session",
});

// Add middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SERVER_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day (in milliseconds)
    },
  })
);
app.use(passport.authenticate("session"));

// Routes
app.use("/api/auth", authRouter);

// Start server
app.listen(port, () => {
  console.log("Listening on port:", port);
});
