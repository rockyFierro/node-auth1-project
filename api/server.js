const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const userRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');

/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */
const session = require('express-session');
const Store = require('connect-session-knex')(session);
const knex = require('../data/db-config');

const server = express();

server.use(session({ //use session and pass it a configuration object
  //name of the session
  name: 'chocolatechip',
  //must move this later, never hardcode, move to a configuration file outside the code
  secret: 'keep it safe',
  //don't trigger a session for just anybody!
  saveUninitialized: false,
  //don't need it later,
  resave: false,
  //configure the store that was instantiated
  store: new Store({
    //another level down, we are configuring the new store
    knex,
    createTable: true,
    clearInterval: 1000 * 60 * 10, //second * 60 = 1 minute * 10 = 
    tablename: 'sessions',  
    sidfieldname: 'sid'
  }) ,
  //now config the cookie
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: true,
    //samesite: none ; look into https
  },
}));

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', userRouter);
server.use('/api/auth', authRouter);

server.get("/", (req, res) => {
  res.json({ api: "it's alive! ALIVE!" });
});


server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
