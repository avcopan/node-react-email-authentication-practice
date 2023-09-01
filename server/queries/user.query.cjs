const pool = require("../modules/pool.cjs");

/** Look up a user by their email
 *
 * @param {Object} user An object containing the user's email
 * @returns {Object} The user row, if present; otherwise, undefined
 */
const lookupUser = async (user) => {
  const queryString = 'SELECT * FROM "user" WHERE email = $1;';
  const queryParams = [user.email];

  try {
    const result = await pool.query(queryString, queryParams);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

/** Add a user by email, if they don't exist
 *
 * @param {Object} user An object containing the user's email
 * @returns {Object} The user row
 */
const addUser = async (user) => {
  console.log("IN addUser");
  console.log("user:", user);

  // If the user already exists, return the row
  const existingUser = await lookupUser(user);
  if (existingUser) {
    console.log("Returning existing user:", existingUser);
    return existingUser;
  }

  // Otherwise, add them
  const queryString = 'INSERT INTO "user" (email) VALUES ($1) RETURNING *;';
  const queryParams = [user.email];

  try {
    const result = await pool.query(queryString, queryParams);
    console.log("Returning new user:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  lookupUser,
  addUser,
};

// addUser({ email: "example6@gmail.com" }).then(console.log);
// addUser({ email: "example8@gmail.com" }).then(console.log);
