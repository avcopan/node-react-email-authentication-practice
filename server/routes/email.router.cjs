const express = require("express");
const {
  sendEmailMiddleware,
  verifyEmailMiddleware,
} = require("../middlewares/auth.middleware.cjs");

const router = express.Router();

router.post("/send", sendEmailMiddleware, (req, res) => {
  res.send({ msg: "Check your email" });
});

router.get("/verify", verifyEmailMiddleware, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
