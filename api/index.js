const express = require('express');
const Scraper = require('./../utils/scraper');
const r = require('rethinkdb');

const router = new express.Router();

router.get('/', (req, res) => {
  const response = {
    data: {
      endpoints: {
        list: {
          description: 'List all Brampton Transit stops.',
          url: '/api/list',
        },
        stop: {
          description: 'Real-time schedules for a stop.',
          url: '/api/stop/:stop',
        },
      },
      source: {},
    },
    meta: {
      status: 203,
      message: 'OK',
    },
  };
  res.status(response.meta.status).json(response);
});

router.get('/list', (req, res, next) => {
  const response = {
    data: null,
    meta: {
      status: 501,
      message: 'Not yet implemented.',
    },
  };
  res.status(response.meta.status).json(response);
});

router.get('/stops', (req, res, next) => {
  r.table('stops').run(global.conn, (err, cursor) => {
    if (err) return next(err)

    cursor.toArray(function(err, result) {
      if (err) return next(err);

      const response = {
        data: result,
        meta: {
          status: 200,
          message: 'OK',
        },
      };

      res.status(response.meta.status).json(response);
    });
  });
});

router.get('/stop/:stop', (req, res, next) => {
  Scraper.getStopData(req.params.stop)
    .then((data) => {
      const response = {
        data,
        meta: {
          status: 200,
          message: 'OK',
        },
      };
      res.status(response.meta.status).json(response);
    })
    .catch((e) => next(e));
});

router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

router.use((err, req, res, next) => {
  const message = err.message || 'Unexpected Error';
  const status = err.status || 500;

  const response = {
    data: null,
    meta: { status, message },
  };

  res.status(status).json(response);
});

module.exports = router;
