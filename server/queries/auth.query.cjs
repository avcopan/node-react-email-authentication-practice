const pool = require("../modules/pool.cjs");

/** Look up a user by email
 *
 * @param {String} email The user's email
 * @returns {Object} The user row, if present; otherwise, undefined
 */
const lookupUser = async (email) => {
  const queryString = "SELECT * FROM users WHERE email = $1;";
  const queryParams = [email];

  try {
    const result = await pool.query(queryString, queryParams);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

/** Add a user by email, if they don't exist
 *
 * @param {String} email The user's email
 * @returns {Object} The user row
 */
const addUser = async (email) => {
  // If the user already exists, return the row
  const user = lookupUser(email);
  if (user) {
    return user;
  }

  // Otherwise, add them
  const queryString = "INSERT INTO users (email) VALUES ($1) RETURNING *;";
  const queryParams = [email];

  try {
    const result = await pool.query(queryString, queryParams);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  lookupUser,
  addUser,
};

lookupUser("example9@gmail.com").then(console.log);
lookupUser("example2@gmail.com").then(console.log);
