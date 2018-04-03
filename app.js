var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var session = require('client-sessions');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session setup
app.use(session({
  cookieName: 'session',
  secret: 'make_random',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

// auth setup
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if(err) { return done(err); }

      if(!user) {
        return done(null, false, { message: 'Incorrect password or username.' });
      }

      if(!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password or username' });
      }

      return done(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function(err, user) {
    if(err) { return cb(err); }
    cb(null, user);
  });
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
