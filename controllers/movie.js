const Movie = require('../models/movie');

const { SUCCESS_OK_CODE, SUCCESS_CREATED_CODE } = require('../utils/constants');

const BadRequestError = require('../errors/bad-request-error');
const InternalServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');

const getMovies = (req, res, next) => {
  const { _id } = req.user;

  Movie.find({ owner: _id })
    .then((movies) => {
      if (movies === null) {
        return next(new NotFoundError('Фильмы не найдены'));
      }

      return res.status(SUCCESS_OK_CODE).send(movies);
    })
    .catch(() => {
      next(new InternalServerError('Произошла ошибка'));
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user,
  })
    .then((movie) => res.status(SUCCESS_CREATED_CODE).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        console.log(error);
        return next(new BadRequestError('Переданы некорректные данные'));
      }

      return next(new InternalServerError('Произошла ошибка'));
    });
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.params;

  Movie.findByIdAndDelete(_id)
    .then((movie) => {
      if (movie === null) {
        return next(new NotFoundError('Фильм не найден'));
      }

      return res.status(SUCCESS_OK_CODE).send(movie);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Фильм не найден'));
      }

      return next(new InternalServerError('Произошла ошибка'));
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
