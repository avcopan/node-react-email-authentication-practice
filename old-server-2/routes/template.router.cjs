const express = require('express');
const pool = require('../modules/pool.cjs');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware.cjs');

/**
 * GET route template
 */
router.get('/', rejectUnauthenticated, (req, res) => {
  res.send({"HEY": "THERE"})
  // GET route code here
});

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;
