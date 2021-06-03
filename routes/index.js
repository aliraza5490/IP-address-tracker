var express = require('express');
var router = express.Router();
const path = require('path')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../pages/index.html'));
})
router.get('/api', function (req, res, next) {
  res.send('Hello From API')
});

module.exports = router;
