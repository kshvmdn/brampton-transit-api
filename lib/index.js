const express = require('express');
const router = express.Router();

const getStopData = require('./get-stop-data');

router.get('/', (req, res, next) => {
  res.json({
    'meta': {
      'instructions': 'API available at /api/:stop, retrieve stop IDs from http://nextride.brampton.ca/RealTime.aspx.'
    }
  });
});

router.get('/:stop', (req, res, next) => {
  getStopData(req.params.stop)
    .then(data => res.json(data))
    .catch(e => next(e));
});

router.get('*', (req, res, next) => {
  res.redirect('/');
})

module.exports = router;
