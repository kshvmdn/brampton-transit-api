#!/usr/bin/env node
const express = require('express');
const app = express();

const routes = require('./routes');
app.use('/', routes);

const port = process.env.PORT || 3000;
const address = process.env.ADDRESS || '127.0.0.1';

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  let message = err && err.message ? err.message : 'Unexpected Error';
  let status = err && err.status ? err.status : 500;

  let response = {
    data: null,
    meta: { status, message }
  };

  res.status(status).json(response);
});

const server = app.listen(port, address, () => {
  console.log(`Listening @ http://${server.address().address}:${server.address().port}.`);
});

module.exports = app;
