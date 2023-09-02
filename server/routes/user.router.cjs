/**
 * User information routes
 * 
 * Prefix: /api/user
 *
 * (See https://apidocjs.com/ for API documentation format)
 */
const express = require("express");
const {
  requireAuthenticationMiddleware,
} = require("../middlewares/auth.middleware.cjs");

const router = express.Router();

/**
 * @api {get} /api/user Get user information based on session cookie
 * 
 * @apiSuccess (200) {Object} The user object, with `id` and `email` fields
 */
router.get("/", requireAuthenticationMiddleware, (req, res) => {
  res.send(req.user);
});

module.exports = router;
