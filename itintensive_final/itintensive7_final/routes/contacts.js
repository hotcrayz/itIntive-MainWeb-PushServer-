var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/contacts', function(req, res, next) {
    res.render('contacts.html');
    res.end(data);
});

module.exports = router;
