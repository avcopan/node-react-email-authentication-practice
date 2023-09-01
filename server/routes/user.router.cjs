const express = require("express");
const {
  requireAuthenticationMiddleware,
} = require("../middlewares/auth.middleware.cjs");

const router = express.Router();

router.get("/", requireAuthenticationMiddleware, (req, res) => {
  res.send(req.user);
});

module.exports = router;
