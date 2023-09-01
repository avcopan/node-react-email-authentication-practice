const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware.cjs");
const pool = require("../modules/pool.cjs");
const linkStrategy = require("../strategies/link.strategy.cjs");

const router = express.Router();

// Handles GET request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
router.post("/register", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const queryText = `INSERT INTO "user" (username, password)
    VALUES ($1, $2) RETURNING id`;
  pool
    .query(queryText, [username, password])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post(
  "/email",
  linkStrategy.authenticate("magiclink", { action: "requestToken" }),
  (req, res) => {
    res.send({ msg: "Check your email" });
  }
);

router.get(
  "/login",
  linkStrategy.authenticate("magiclink", {
    action: "acceptToken",
    allowReuse: true,
    userPrimaryKey: "id",
  }),
  (req, res) => {
    console.log("WE GOT HERE");
    res.sendStatus(200);
  }
);

// clear all server session information about this user
router.post("/logout", (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
