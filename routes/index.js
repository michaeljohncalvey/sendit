var express = require('express');
var router = express.Router();
var hannafords = require('../data/hannafords.js').hannafords;
var subway = require('../data/subway.js').subway;
var MongoClient = require('mongodb').MongoClient;
var db;
var session;
var passport = require('passport');

// util functions
var retrieveUser = require('./utils.js').retrieveUser;
var getSession = require('./utils.js').getSession;
var createSession = require('./utils.js').createSession;
var parseCookies = require('./utils.js').parseCookies;

MongoClient.connect('mongodb://localhost:27017/', function (err, client) {
  if(err) throw err;
  db = client.db('USER_DATA');
})

/* GET home page. */
router.get('/', function(req, res, next) {
  // check session
  session = getSession(req);
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    console.log("session id: " + session.user._id);
    console.log('Session: ' + JSON.stringify(session));
    res.cookie('session', JSON.stringify(session));
  }

  var locations = [ hannafords, subway ];
  console.log(locations.length)
  res.render('index', { locations: locations, session: session });
});

router.get('/:location', function(req, res) {
  //check session
  session = getSession(req);
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    res.cookie('session', session);
  }

  var location;
  if(req.params.location == "hannafords") {
    location = hannafords;
  } else if(req.params.location == "subway") {
    location = subway;
  }
  res.render('menu', { location: location, session: session });
});

router.get('/cart', function(req, res, next) {
  // check session
  session = getSession(req);
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    res.cookie('session', session);
  }

  res.render('cart', { session: session });
});

function nextId() {
  return db.collection('users').find().sort({_id:-1}).limit(1)[0];
}

module.exports = router;
