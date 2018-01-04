var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/teacher1', function(req, res, next) {
    res.render('teacher1.html');
    res.end(data);
});

module.exports = router;
