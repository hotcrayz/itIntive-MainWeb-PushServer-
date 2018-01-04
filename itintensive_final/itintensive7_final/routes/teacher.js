var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/teacher', function(req, res, next) {
    res.render('index.html');
    res.end(data);
});

module.exports = router;
