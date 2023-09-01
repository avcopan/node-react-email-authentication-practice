const passport = require("../modules/passport.cjs");

const sendEmailMiddleware = passport.authenticate("magiclink", {
  action: "requestToken",
});

const verifyEmailMiddleware = passport.authenticate("magiclink", {
  action: "acceptToken",
  allowReuse: true,
});

const requireAuthenticationMiddleware = (req, res, next) => {
  // check if logged in
  if (req.isAuthenticated()) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
    next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
};

module.exports = { sendEmailMiddleware, verifyEmailMiddleware, requireAuthenticationMiddleware };
