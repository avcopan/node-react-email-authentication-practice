const express = require('express');
require('dotenv').config();

const app = express();

const sessionMiddleware = require('./middlewares/session.middleware.cjs');
const passport = require('./strategies/link.strategy.cjs');

// Route includes
const userRouter = require('./routes/user.router.cjs');

// Express middleware
app.use(express.json());

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 8002;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
