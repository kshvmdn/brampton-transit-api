const express = require('express');
const router = express.Router();

const api = require('./api');

router.use('/api', api);

router.get('/', (req, res, next) => {
  let response = {
    endpoints: {
      list: {
        description: 'List all Brampton Transit stops.',
        url: '/api/list'
      },
      stop: {
        description: 'Real-time schedules for a stop.',
        url: '/api/stop/:stop'
      }
    },
    meta: {
      status: 200,
      message: 'OK'
    }
  };
  res.json(response);
});

module.exports = router;
