var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/page1', function(req, res, next) {
  res.render('page1.html');
  res.end(data);
});

module.exports = router;
