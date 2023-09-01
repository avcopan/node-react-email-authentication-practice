// Router imports
const express = require("express");
const router = express.Router();

// Passport / Sendgrid imports
const passport = require("passport");
const MagicLinkStrategy = require("passport-magic-link").Strategy;
const sendgrid = require("@sendgrid/mail");
const query = require("../queries/auth.query.cjs");

// Configure the MagitLinkStrategy
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

passport.use(
  new MagicLinkStrategy(
    {
      secret: process.env.SERVER_SESSION_SECRET,
      userFields: ["email"],
      tokenField: "token",
      verifyUserAfterToken: true,
    },
    function send(user, token) {
      var link = "http://localhost:3000/login/email/verify?token=" + token;
      var msg = {
        to: user.email,
        from: process.env.SENDGRID_EMAIL,
        subject: "Sign in to Todos",
        text:
          "Hello! Click the link below to finish signing in to Todos.\r\n\r\n" +
          link,
        html:
          '<h3>Hello!</h3><p>Click the link below to finish signing in to Todos.</p><p><a href="' +
          link +
          '">Sign in</a></p>',
      };
      return sendgrid.send(msg);
    },
    function verify(user) {
      return query.addUser(user.email);
    }
  )
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => cb(null, { id: user.id, email: user.email }));
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user));
});

router.post(
  "/email",
  passport.authenticate("magiclink", { action: "requestToken" }),
  (req, res) => {
    res.send({ message: "Check your email" });
  }
);

router.get("/verify", passport.authenticate("magiclink"));

module.exports = router;
