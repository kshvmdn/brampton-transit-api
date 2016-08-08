const cron = require('node-cron');
const express = require('express');
const hbs = require('express-handlebars');
const http = require('http');
const morgan = require('morgan');
const path = require('path');
const r = require('rethinkdb');

const api = require('./api');
const Scraper = require('./utils/scraper');

const app = express();
const server = http.createServer(app);

app.configure = (cb) => {
  app.use(morgan('dev'));

  app.engine('handlebars', hbs({ defaultLayout: 'single' }));
  app.set('view engine', 'handlebars');

  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', (req, res) => {
    res.render('home', {});
  });

  app.use('/api', api);

  app.get('/*', (req, res) => {
    res.redirect('/');
  });

  const task = cron.schedule('* 0 0 1 * *', () => {
    Scraper.getStopsList();
  }, true);

  if (process.env.SCRAPE === '1') {
    Scraper.getStopsList();
  }

  if (cb) cb();
};

module.exports = { app, server, r };
