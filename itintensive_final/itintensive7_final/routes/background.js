var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/background', function(req, res, next) {
  res.render('background.html');
  res.end(data);
});

module.exports = router;
