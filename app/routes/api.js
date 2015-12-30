var express = require('express');
var exec = require('child_process').exec;
var router = express.Router();

router.get('/', function(req, res, next) {
	var stop = parseInt(req.query.stop);
	if (stop == null || !stop || isNaN(stop) ) {
		res.json({ 'status': 400, 'message': 'Invalid stop code.'});
		return;
	}
	exec('python3 main.py ' + stop, {cwd: '../scraper'}, function(error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		}
	});
});

module.exports = router;
