var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/teacher2', function(req, res, next) {
    res.render('teacher2.html');
    res.end(data);
});

module.exports = router;
