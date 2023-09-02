/**
 * Defines middlewares for authentication
 * 
 * Middlewares 1 and 2 will only be used once, for sending the verification email, and
 * for accepting the token from a magic link click.
 * 
 * Middleware 3 will be used on any subsequent route that requires authentication.
 */
const passport = require("../modules/passport.cjs");

/**
 * Middleware 1: On POST request form entering an unverified email, this triggers
 * sending an email to the user with a magic link
 */
const sendEmailMiddleware = passport.authenticate("magiclink", {
  action: "requestToken",
});

/**
 * Middleware 2: On GET request from clicking a magic link, this triggers checking the
 * magic link token and, if valid, entering the authenticated user into the database
 */
const verifyEmailMiddleware = passport.authenticate("magiclink", {
  action: "acceptToken",
  allowReuse: true,
});

/** 
 * Middleware 3: On any protected route, this checks the user's session cookie to see
 * whether they are authenticated; if not, it returns a 403 Forbidden status; otherwise,
 * it procedes with handling the request and response for the authenticated user.
 */
const requireAuthenticationMiddleware = (req, res, next) => {
  // check if logged in
  if (req.isAuthenticated()) {
    // They were authenticated! User may do the next thing
    next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
};

module.exports = { sendEmailMiddleware, verifyEmailMiddleware, requireAuthenticationMiddleware };
