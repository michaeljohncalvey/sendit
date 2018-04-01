var express = require('express');
var router = express.Router();
var hannafords = require('../data/hannafords.js').hannafords;
var subway = require('../data/subway.js').subway;


/* GET home page. */
router.get('/', function(req, res, next) {
  var locations = [ hannafords, subway ];
  console.log(locations.length);
  res.render('index', { locations: locations });
});

router.get('/:location', function(req, res) {
  var location;
  if(req.params.location == "hannafords") {
    location = hannafords;
  } else if(req.params.location == "subway") {
    location = subway;
  }
  res.render('menu', { location: location });
});

router.get('/cart', function(req, res, next) {
  res.render('cart');
});

module.exports = router;
