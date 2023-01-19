const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Joi, celebrate, errors } = require('celebrate');

const userRouter = require('./routes/user');
const movieRouter = require('./routes/movie');

const { checkAuth } = require('./middlewares/auth');

const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use('/users', checkAuth, userRouter);

app.use('/movies', checkAuth, movieRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'Произошла ошибка' : message });

  next();
});

mongoose.connect('mongodb://127.0.0.1/bitfilmsdb', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB!');

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
