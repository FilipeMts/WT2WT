'use strict';

const {
  join
} = require('path');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const serveFavicon = require('serve-favicon');

const hbs = require('hbs');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo(expressSession);

const User = require('./models/user');
const Suggestion = require('./models/suggestion');
const Mtv = require('./models/mtv');
const Approve = require('./models/approve');
const List = require('./models/list');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const authRouter = require('./routes/auth');
//const passportSetup = require('./passport-config')
const tmdbRouter = require('./routes/tmdb');
const mtvRouter = require('./routes/mtv');
const listRouter = require('./routes/list');
const approveRouter = require('./routes/approve');
const followRouter = require('./routes/follow');

const app = express();

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials");

app.use(logger('dev'));
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(serveFavicon(join(__dirname, 'public/images', 'favicon.ico')));
app.use(sassMiddleware({
  src: join(__dirname, 'public'),
  dest: join(__dirname, 'public'),
  outputStyle: process.env.NODE_ENV === 'development' ? 'nested' : 'compressed',
  sourceMap: true
}));
app.use(express.static(join(__dirname, 'public')));

// Express-Session
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 15,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development'
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24
    })
  })
);


// Passport
require('./passport-config');

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', authRouter);
app.use('/', tmdbRouter);
app.use('/', mtvRouter);
app.use('/', listRouter);
app.use('/', approveRouter);
app.use('/', followRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;