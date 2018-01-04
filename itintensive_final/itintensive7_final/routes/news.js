var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/news', function(req, res, next) {
    res.render('news.html');
    res.end(data);
});

module.exports = router;
