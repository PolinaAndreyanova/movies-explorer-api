require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const routes = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error');

const { PORT = 3001, NODE_ENV, MONGO_DB } = process.env;

const app = express();

app.use(bodyParser.json());

// const allowedCors = [
//
// ];

// app.use((req, res, next) => {
//   const { origin } = req.headers;

//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   const { method } = req;

//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

//   const requestHeaders = req.headers['access-control-request-headers'];

//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);

//     return res.end();
//   }

//   return next();
// });

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

mongoose.connect(NODE_ENV === 'production' ? MONGO_DB : 'mongodb://127.0.0.1/bitfilmsdb', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB!');

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
