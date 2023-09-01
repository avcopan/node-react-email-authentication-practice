const sendgrid = require("@sendgrid/mail");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

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

module.exports = sendEmailWithToken;
