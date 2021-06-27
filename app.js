var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session")
const passport = require('passport')
const LocalStorategy = require('passport-local').Strategy

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const users = [
  { username: 'alice', password: 'alice', age: 22 },
  { username: 'bob', password: 'bob', age: 21 },
  { username: 'carol', password: 'carol', age: 30 }
]

const User = {
  findOne({ username }) {
    return users.find(user => user.username === username) || null
  }
}

passport.use(new LocalStorategy(function(username, password, done) {
  try {
    const user = User.findOne({ username })
    if (user == null) {
      return done(null, false)
    }
    if (user.password !== password) {
      return done(null, false)
    }
    delete user.password
    return done(null, user)
  } catch (err) {
    done(err)
  }
}))

app.use(session({
  secret: "cats",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  const user = User.findOne({ username })
  done(null, user);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
