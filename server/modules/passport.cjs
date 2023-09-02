/**
 * Sets up Passport JS authentication using the "magic link" strategy
 * 
 * Documentation: https://github.com/vinialbano/passport-magic-link#example
 */
const passport = require("passport");
const MagicLinkStrategy = require("passport-magic-link").Strategy;

const userQuery = require("../queries/user.query.cjs");
const sendEmailWithToken = require("./email.cjs");

/**
 * Stores the ID from the user object as the identifier for the cookie session
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Uses the ID from the user object stored in cookie session to retrieve the user object
 */
passport.deserializeUser((id, done) => {
  userQuery
    .getUser(id)
    .then((user) => (user ? done(null, user) : done(null, null)))
    .catch((error) => {
      console.error("Error with query while deserializing user ", error);
      done(error, null);
    });
});

/**
 * Initializes the magic link authentication strategy using three arguments:
 * 
 * Documentation: https://github.com/vinialbano/passport-magic-link#example
 * 
 * MagicLink(options, sendToken, verifyUser)
 * 
 * options: Configuration options, including session secret and a flag to trigger
 *    automatic verification when the token is received (on magic link click).
 * sendToken: A function that takes `(user, token)`, a user object and a token, and
 *    sends an email to `user.email` with a link to verify their email using the token.
 * verifyUserAfterToken: A function that takes a `user` object for a user that has
 *    verified their email with a token and determines what to do with it. For us, we
 *    add the user to he database.
 */
passport.use(
  new MagicLinkStrategy(
    // options
    {
      secret: process.env.SERVER_SESSION_SECRET,
      userFields: ["email"],
      tokenField: "token",
      verifyUserAfterToken: true,
    },
    // sendToken
    sendEmailWithToken,
    // verifyUser
    userQuery.addUser
  )
);

module.exports = passport;
