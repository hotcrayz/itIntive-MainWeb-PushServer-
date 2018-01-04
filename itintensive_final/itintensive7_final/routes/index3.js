var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index3', function(req, res, next) {
    res.render('index3.html');
    res.end(data);
});

module.exports = router;
