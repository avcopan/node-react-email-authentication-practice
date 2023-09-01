const sendgrid = require("@sendgrid/mail");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailWithToken = (user, token) => {
  const port = process.env.PORT;
  const link = `http://localhost:${port}/api/email/verify?token=${token}`;
  return sendgrid.send({
    to: user.email,
    from: process.env.SENDGRID_EMAIL,
    subject: "Sign in",
    text: `Hello! Click the link below to finish signing in.\r\n\r\n${link}`,
    html: `
      <h3>Hello!</h3>
      <p>Click the link below to finish signing in.</p>
      <p><a href="${link}">Sign in</a></p>
    `,
  });
};

module.exports = sendEmailWithToken;
