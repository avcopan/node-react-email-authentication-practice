const passport = require("passport");
const sendgrid = require("@sendgrid/mail");
const MagicLinkStrategy = require("passport-magic-link").Strategy;
const pool = require("../modules/pool.cjs");
const userQuery = require("../queries/user.query.cjs");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  pool
    .query('SELECT * FROM "user" WHERE id = $1', [id])
    .then((result) => {
      // Handle Errors
      const user = result && result.rows && result.rows[0];

      if (user) {
        // user found
        delete user.password; // remove password so it doesn't get sent
        // done takes an error (null in this case) and a user
        done(null, user);
      } else {
        // user not found
        // done takes an error (null in this case) and a user (also null in this case)
        // this will result in the server returning a 401 status code
        done(null, null);
      }
    })
    .catch((error) => {
      console.log("Error with query during deserializing user ", error);
      // done takes an error (we have one) and a user (null in this case)
      // this will result in the server returning a 500 status code
      done(error, null);
    });
});

const sendEmail = (user, token) => {
  const link = "http://localhost:3000/api/user/login?token=" + token;
  return sendgrid.send({
    to: user.email,
    from: process.env.SENDGRID_EMAIL,
    subject: "Sign in",
    text:
      `Hello! Click the link below to finish signing in.\r\n${token}\r\n` + link,
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
    sendEmail,
    userQuery.addUser
  )
);

module.exports = passport;
