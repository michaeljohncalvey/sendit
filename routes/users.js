var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var db;
var sess = { loggedIn: true, id: 0 };

MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
  if(err) throw err;
  db = client.db('USER_DATA');
})

router.get('/login', function(req, res, next) {
  //sess = req.session;
  res.render('users/login', { sess: sess });
});

router.post('/login', function(req, res, next) {
  //sess = req.session;
  //TODO: login code here
  login(sess);
  res.redirect('/');
});

router.post('/logout', function(req, res, next) {
  //sess = req.session;
  logout(sess);
  res.redirect('/');
});

router.get('/create', function(req, res, next) {
  //sess = req.session;
  res.render('users/create', { sess: sess });
});

router.post('/create', function(req, res, next) {
  //sess = req.session;
  var newUser = {id: getNextId(), firstname: req.body.firstname, lastname: req.body.lastname, uname: req.body.uname, pass: req.body.pass};
  db.collection("users").insertOne
  res.redirect('/created');
});

router.get('/created', function(req, res, next) {
  res.render('users/created', { sess: sess });
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  res.render('users/show', { sess: sess });
});


// Auth functions

// login
function login(sess) {
  //TODO: add integration with passport-local
  sess.loggedIn = true;
}

// logout
function logout(sess) {
  sess.loggedIn = false;
  console.log("logging out....");
}

module.exports = router;
