const express = require('express');
const router = express.Router();

const getStopData = require('../helpers/get-stop-data');

router.get('/', (req, res, next) => {
  let response = {
    data: {
      description: 'Real-time API for Brampton Transit bus schedules.',
      url: {
        stop_info: 'http://nextride.brampton.ca/RealTime.aspx.',
        endpoints: req.headers.host
      }
    },
    meta: {
      status: 203,
      message: 'OK'
    }
  };
  res.status(meta.response.status).json(response);
});

router.get('/list', (req, res, next) => {
  let response = {
    data: null,
    meta: {
      status: 501,
      message: 'Not yet implemented.'
    }
  };
  res.status(response.meta.status).json(response);
});

router.get('/stop/list', (req, res, next) => {
  let response = {
    data: null,
    meta: {
      status: 501,
      message: 'Not yet implemented.'
    }
  };
  res.status(response.meta.status).json(response);
});

router.get('/stop/:stop', (req, res, next) => {
  getStopData(req.params.stop)
    .then((data) => {
      let response = {
        data: data,
        meta: {
          status: 200,
          message: 'OK'
        }
      };
      res.status(response.meta.status).json(response);
    })
    .catch((e) => next(e));
});

module.exports = router;