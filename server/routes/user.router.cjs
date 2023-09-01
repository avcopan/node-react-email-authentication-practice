const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware.cjs");
const linkStrategy = require("../strategies/link.strategy.cjs");

const router = express.Router();

router.get("/", rejectUnauthenticated, (req, res) => {
  res.send(req.user);
});

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
  }),
  (req, res) => {
    console.log("WE GOT HERE");
    res.sendStatus(200);
  }
);

module.exports = router;
