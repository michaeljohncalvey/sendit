var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var db;
var session;
var passport = require('passport');
var sha3_512 = require('js-sha3').sha3_512;

// util functions
var retrieveUser = require('./utils.js').retrieveUser;
var getSession = require('./utils.js').getSession;
var createSession = require('./utils.js').createSession;
var parseCookies = require('./utils.js').parseCookies;

MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
  if(err) throw err;
  db = client.db('USER_DATA');
})

router.get('/login', function(req, res, next) {
  // check session
  session = getSession(req);
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    res.cookie('session', session);
  }

  res.render('users/login', { session: session });
});

router.post('/login', function(req, res, next) {
  // check existing session
  session = getSession(req);
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    res.cookie('session', session);
  }

  //TODO: login code here
  if(authenticate(req, res)) {
    req.flash('Logged in');
    res.redirect('/');
  } else {
    req.flash('incorrect email or password, please try again');
    res.redirect('/users/login');
  }
});

router.post('/logout', function(req, res, next) {
  logout(req, res);
  res.redirect('/');
});

router.get('/create', function(req, res, next) {
  session = getSession(req);
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    res.cookie('session', session);
  }

  res.render('users/create', { session: session });
});

router.post('/create', function(req, res, next) {
  // TODO: Check if email is used, enforce password security measures
  // check session
  session = getSession(req);
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    res.cookie('session', session);
  }
  
  var newUser = {_id: session._id, email: req.body.email, phash: sha3_512(req.body.password)};
  db.collection("users").update(newUser);
  res.redirect('/created');
});

router.get('/created', function(req, res, next) {
  session = getSession(req);
  res.render('users/' + session.users._id, { session: session });
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  session = getSession(req);
  res.render('users/show', { session: session });
});


// Auth functions

// perform authentication for login
// return true if successful
function authenticate(req, res) {
  var foundUser = retrieveUser(db, req.body.email);

  if(!foundUser) return false;
  console.log('user found');
  
  if(!sha3_512(req.body.password) === foundUser.password) {
    console.log('Password authenticated');
  
    console.log('saving cookie');
    res.writeHead('session', createSession(user, true));
    return false;
  } else return true;
}

// logout
function logout(req, res) {
  res.writeHead('session', createSession({}, false));
}

function nextId() {
  return db.collection('users').find().sort({_id:-1}).limit(1)[0];
}

module.exports = router;
