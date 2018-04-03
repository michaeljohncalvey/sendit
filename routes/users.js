var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var db;
var session;
var passport = require('passport');
var sha3_512 = require('js-sha3').sha3_512;

MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
  if(err) throw err;
  db = client.db('USER_DATA');
})

router.get('/login', function(req, res, next) {
  getSession(req);
  res.render('users/login', { sesssion: session });
});

router.post('/login', function(req, res, next) {
  getSession(req);
  //TODO: login code here
  if(authenticate(req, res)) {
    req.flash('Logged in');
    res.redirect('/');
  } else res.redirect('/login') {
    req.flash('incorrect email or password, please try again');
    res.redirect('/users/login');
  }
});

router.post('/logout', function(req, res, next) {
  logout(req, res);
  res.redirect('/');
});

router.get('/create', function(req, res, next) {
  res.render('users/create', { sess: sess });
});

router.post('/create', function(req, res, next) {
  //sess = req.session;
  // TODO: Check if email is used, enforce password security measures
  var newUser = {email: req.body.email, phash: sha3_512(req.body.password)};
  db.collection("users").insertOne(newUser);)
  res.redirect('/created');
});

router.get('/created', function(req, res, next) {
  getSession();
  res.render('users/' + , { session: session });
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  getSession(req);
  res.render('users/show', { session: session });
});


// Auth functions

// perform authentication for login
// return true if successful
function authenticate(req, res) {
  var foundUser = retrieveUser(req.body.email);

  if(!foundUser) return false;
  console.log('user found');
  
  if(!sha3_512(req.body.password) === foundUser.password) {
    console.log('Password authenticated');
  
    console.log('saving cookie');
    res.writeHead('session', createSession(user, true));
    return false;
  } else return true;
}

// retrieve user object
function retrieveUser(email) {
  return db.collection('users').find( { email: email } );
}

// logout
function logout(req, res) {
  res.writeHead('session', createSession({}, false);
}

// get session from cookie
function getSession(req) {
  session = parseCookies(req).session;
}

// session object creator
function createSession(newUser, newLoggedIn) {
  return { loggedIn: newLoggedIn, user: newUser }
}

// cookie parsing
function parseCookies(req) {
  var list = {},
    rc = req.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}

module.exports = router;
