const express = require('express');
const hbs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');

const api = require('./api');

const port = process.env.PORT || 3001;
const address = process.env.ADDRESS || 'localhost';

const app = express();

app.engine('handlebars', hbs({ defaultLayout: 'single' }));
app.set('view engine', 'handlebars');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home', {});
});

app.use('/api', api);

app.get('/*', (req, res) => {
  res.redirect('/');
});

const server = app.listen(port, address, () => {
  console.log(`Listening @ http://${server.address().address}:${server.address().port}.`);
});

module.exports = app;
