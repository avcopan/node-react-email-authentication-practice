const passport = require("passport");
const sendgrid = require("@sendgrid/mail");
const userQuery = require("../queries/user.query.cjs");
const MagicLinkStrategy = require("passport-magic-link").Strategy;

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

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

const sendEmailWithToken = (user, token) => {
  const link = "http://localhost:3000/api/user/login?token=" + token;
  return sendgrid.send({
    to: user.email,
    from: process.env.SENDGRID_EMAIL,
    subject: "Sign in",
    text:
      `Hello! Click the link below to finish signing in.\r\n${token}\r\n` +
      link,
    html:
      `<h3>Hello!</h3><p>Click the link below to finish signing in ${token}.</p><p><a href="` +
      link +
      '">Sign in</a></p>',
  });
};

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
