var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var db;
var session;
var sha3_512 = require('js-sha3').sha3_512;
var Cookies = require('cookies');
var cookies;

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
  cookies = new Cookies(req, res);
  session = JSON.parse(decodeURIComponent(cookies.get('session')));
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    cookies.set('session', JSON.stringify(session));
  }

  res.render('users/login', { session: session });
});

router.post('/login', function(req, res, next) {
  // check existing session
  cookies = new Cookies(req, res);
  session = JSON.parse(decodeURIComponent(cookies.get('session')));
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    cookies.set('session', JSON.stringify(session));
  }

  //TODO: login code here
  if(authenticate(req, res)) {
    res.redirect('/');
  } else {
    res.redirect('/users/login');
  }
});

router.post('/logout', function(req, res, next) {
  logout(req, res);
  res.redirect('/');
});

router.get('/create', function(req, res, next) {
  // check session
  cookies = new Cookies(req, res);
  session = JSON.parse(decodeURIComponent(cookies.get('session')));
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    cookies.set('session', JSON.stringify(session));
  }

  res.render('users/create', { session: session });
});

router.post('/create', function(req, res, next) {
  // TODO: Check if email is used, enforce password security measures
  // check session
  cookies = new Cookies(req, res);
  session = JSON.parse(decodeURIComponent(cookies.get('session')));
  if(!session) {
    session = createSession( { _id: 0 }, false);
    cookies.set('session', JSON.stringify(session));
  }
 
  console.log("user " + session);
  var newUser = {_id: session.user._id, email: req.body.email, phash: sha3_512(req.body.password)};
  console.log("New User id: " + newUser);
  db.collection("users").update(newUser);
  session = createSession(newUser, true);
  cookies.set('session', JSON.stringify(session));
  res.redirect('/');
});

router.get('/created', function(req, res, next) {
  cookies = new Cookies(req, res);
  session = JSON.parse(decodeURIComponent(cookies.get('session')));
  if(!session) {
    session = createSession( { _id: nextId() }, false );
    cookies.set('session', JSON.stringify(session));
    res.redirect('/');
  }
  
  res.render('users/' + session.user._id, { session: session });
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  cookies = new Cookies(req, res);
  session = JSON.parse(decodeURIComponent(cookies.get('session')));
  if(!session) res.redirect('/login');
  res.render('users/show', { session: session });
});


// Auth functions

// perform authentication for login
// return true if successful
function authenticate(req, res) {
  var foundUser = retrieveUser(db, req.body.email);

  if(!foundUser) return false;
  console.log('user found');
  
  if(!sha3_512(req.body.password) === foundUser.password) return false;
  else {
    cookies = new Cookies(req, res);
    session = createSession({_id: foundUser._id, email: foundUser.email, phash: foundUser.phash}, true);
    console.log("Session ATM: " + JSON.stringify(session));
    cookies.set('session', JSON.stringify(session));
    return true
  };
}

// logout
function logout(req, res) {
  cookies = new Cookies(req, res);
  cookies.set('session', JSON.stringify(createSession( { _id: nextId() }, false)));
}

function nextId() {
  var next = db.collection('users').find().sort({_id:-1}).limit(1)[0];
  if(next == undefined) return 0;
  else return next;
}

module.exports = router;
