var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. The asterisk allows refreshing or manual navigation in the browser */
router.get('/*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../dist/core-app/index.html'));
});


module.exports = router;
