var express = require('express');
var router = express.Router();
var hannafords = require('../data/hannafords.js').hannafords;
var subway = require('../data/subway.js').subway;
var MongoClient = require('mongodb').MongoClient;
var db;
var sess = { loggedIn: true, id: 0 };

MongoClient.connect('mongodb://localhost:27017/', function (err, client) {
  if(err) throw err;
  db = client.db('USER_DATA');
})

/* GET home page. */
router.get('/', function(req, res, next) {
  var locations = [ hannafords, subway ];
  console.log(locations.length);
  res.render('index', { locations: locations, sess: sess });
});

router.get('/:location', function(req, res) {
  var location;
  if(req.params.location == "hannafords") {
    location = hannafords;
  } else if(req.params.location == "subway") {
    location = subway;
  }
  res.render('menu', { location: location, sess: sess });
});

router.get('/cart', function(req, res, next) {
  res.render('cart', { sess: sess });
});

module.exports = router;
