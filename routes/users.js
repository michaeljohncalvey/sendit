var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var db;
var sess;

MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
  if(err) throw err;
  db = client.db('USER_DATA');
})

router.get('/create', function(req, res, next) {
  sess = req.session;
  res.render('users/create', { sess: sess });
});

router.post('/create', function(req, res, next) {
  sess = req.session;
  var newUser = {id: getNextId(), firstname: req.body.firstname, lastname: req.body.lastname, uname: req.body.uname, pass: req.body.pass};
  db.collection("users").insertOne
  res.redirect('/created');
});

router.get('/created', function(req, res, next) {
  res.render('users/created', { sess: sess });
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  res.send('users/show', { sess: sess });
});

module.exports = router;
