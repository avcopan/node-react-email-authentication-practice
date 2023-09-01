const passport = require("passport");
const userQuery = require("../queries/user.query.cjs");
const MagicLinkStrategy = require("passport-magic-link").Strategy;

const sendEmailWithToken = require("../modules/email.cjs");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userQuery
    .getUser(id)
    .then((user) => (user ? done(null, user) : done(null, null)))
    .catch((error) => {
      console.error("Error with query during deserializing user ", error);
      done(error, null);
    });
});

// Does actual work of logging in
passport.use(
  new MagicLinkStrategy(
    {
      secret: process.env.SERVER_SESSION_SECRET,
      userFields: ["email"],
      tokenField: "token",
      verifyUserAfterToken: true,
    },
    sendEmailWithToken,
    userQuery.addUser
  )
);

module.exports = passport;
