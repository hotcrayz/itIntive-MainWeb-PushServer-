var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/client04', function(req, res, next) {
    res.render('client04.html');
    res.end(data);
});

module.exports = router;
