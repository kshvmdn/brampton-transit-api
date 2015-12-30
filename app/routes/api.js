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
		if (error !== null) {
			console.log('exec error: ' + error);
			return;
		} else {
			if (JSON.parse(stdout) != null) {
				res.json({'schedule': JSON.parse(stdout), 'meta': {'status': 200, 'message': 'OK'}});
				return;
			} else {
				res.json({'status': 404, 'message': 'No stop found for given code.'});
				return;
			}
		}
	});
});

module.exports = router;
