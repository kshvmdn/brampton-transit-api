var express = require('express');
var exec = require('child_process').exec;
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json(req);
});

module.exports = router;
