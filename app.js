const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use((req, res, next) => {
  req.user = {
    _id: '64d3cc0850cb46aab94fd41d',
  };
  next();
});

app.use('/users', routesUsers);
app.use('/cards', routesCards);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена.' });
});

app.listen(PORT);
