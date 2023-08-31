// External module imports
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const port = process.env.PORT || 8000;

require("dotenv").config();

// Internal module imports
const pool = require("./modules/pool.cjs");
const authRouter = require("./routes/authentication.router.cjs");

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
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day (in milliseconds)
    },
  })
);

// Routes
app.use("/api/authenticate", authRouter);

// Start server
app.listen(port, () => {
  console.log("Listening on port:", port);
})
