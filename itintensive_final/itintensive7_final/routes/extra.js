var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/extra', function(req, res, next) {
    res.render('extra.html');
    res.end(data);
});

module.exports = router;
