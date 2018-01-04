var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/nearcoffeeshop2', function(req, res, next) {
    res.render('nearcoffeeshop2.html');
    res.end(data);
});

module.exports = router;
