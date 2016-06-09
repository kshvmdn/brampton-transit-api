#!/usr/bin/env node
const express = require('express');
const app = express();

const api = require('./lib');
const port = process.env.PORT || 8080;

app.use('/api', api);

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.status(err.status);
  res.json({
    'error': {
      'message': err.message,
      'status': err.status
    }
  })
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}.`));

module.exports = app;
