const Movie = require('../models/movie');

const { SUCCESS_OK_CODE, SUCCESS_CREATED_CODE } = require('../utils/constants');

const BadRequestError = require('../errors/bad-request-error');
const InternalServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const getMovies = (req, res, next) => {
  const { _id } = req.user;

  Movie.find({ owner: _id })
    .populate(['owner'])
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
    .then((movie) => {
      Movie.findById(movie._id)
        .populate(['owner'])
        .then((newMovie) => res.status(SUCCESS_CREATED_CODE).send(newMovie))
        .catch(() => {
          next(new InternalServerError('Произошла ошибка'));
        });
      // res.status(SUCCESS_CREATED_CODE).send(movie);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }

      return next(new InternalServerError('Произошла ошибка'));
    });
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.params;

  Movie.findById(_id)
    .populate(['owner'])
    .then((movie) => {
      if (movie === null) {
        next(new NotFoundError('Фильм не найден'));
      } else if (movie.owner._id.toString() !== req.user._id) {
        next(new ForbiddenError('Доступ запрещён'));
      } else {
        Movie.findByIdAndRemove(_id)
          .populate(['owner'])
          .then(() => {
            res.status(SUCCESS_OK_CODE).send(movie);
          });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Фильм не найден'));
      }

      return next(new InternalServerError('Произошла ошибка'));
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
