var express = require('express');
var router = express.Router();
var hannafords = require('../data/hannafords.js').hannafords;
var subway = require('../data/subway.js').subway;
var mcdonalds = require('../data/mcdonalds.js').mcdonalds;
var MongoClient = require('mongodb').MongoClient;
var db;
var session;
var Cookies = require('cookies');
var cookies;

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
  cookies = new Cookies(req, res);
  var sessTemp = cookies.get('session');
  if(sessTemp != undefined) {
    sessTemp = decodeURIComponent(sessTemp);
    while(sessTemp.charAt(0) === "j" || sessTemp.charAt(0) === ":") {
      sessTemp = sessTemp.substr(1);
    }
    session = JSON.parse(sessTemp);
  }
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    cookies.set('session', JSON.stringify(session));
  }
  var locations = [ hannafords, subway, mcdonalds];
  res.render('index', { locations: locations, session: session });
});

router.get('/:location', function(req, res) {
  //check session
  cookies = new Cookies(req, res);
  var sessTemp = cookies.get('session');
  if(sessTemp != undefined) {
    sessTemp = decodeURIComponent(sessTemp);
    while(sessTemp.charAt(0) === "j" || sessTemp.charAt(0) === ":") {
      sessTemp = sessTemp.substr(1);
    }
    session = JSON.parse(sessTemp);
  }
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    cookies.set('session', JSON.stringify(session));
  }

  var location;
  if(req.params.location == "hannafords") {
    location = hannafords;
  } else if(req.params.location == "subway") {
    location = subway;
  } else if(req.params.location == "mcdonalds") {
    location = mcdonalds;
  }
  res.render('menu', { location: location, session: session });
});

router.get('/cart', function(req, res, next) {
  // check session
  console.log("Or here?");
  cookies = new Cookies(req, res);
  var sessTemp = cookies.get('session');
  if(sessTemp != undefined) {
    sessTemp = decodeURIComponent(sessTemp);
    while(sessTemp.charAt(0) === "j" || sessTemp.charAt(0) === ":") {
      sessTemp = sessTemp.substr(1);
    }
    session = JSON.parse(sessTemp);
  }
  if(!session) {
    session = createSession( { _id: nextId() }, false);
    cookies.set('session', JSON.stringify(session));
  }
  console.log("Hereererere");

  res.render('cart', { session: session });
});

function nextId() {
  var next = db.collection('users').find().sort({_id:-1}).limit(1)[0];
  if(next == undefined) return 0;
  else return next;
}

module.exports = router;
