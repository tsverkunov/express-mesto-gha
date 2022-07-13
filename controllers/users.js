const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { createToken } = require('../utils/jwt');

const { EMAIL_OR_PASSWORD_ERROR_CODE, MONGO_DUPLICATE_ERROR_CODE } = require('../utils/constants');

const DataError = require('../errors/DataError');
const NotFoundError = require('../errors/NotFoundError');
const DuplicateError = require('../errors/DuplicateError');
const EmailOrPasswordError = require('../errors/EmailOfPasswordError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new DataError('Пользователь с указанным _id не найден.'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throw new DataError('Не введен email или пароль.');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new DataError('Пользователь с указанным _id не найден.'));
      }
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return next(new DuplicateError('Email занят'));
      }
      return next(err);
    });
};

module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new DataError('Переданы некорректные данные при обновлении аватара.'));
      }
      if (err.name === 'CastError') {
        return next(new DataError('Пользователь с указанным _id не найден.'));
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new DataError('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.name === 'CastError') {
        return next(new DataError('Пользователь с указанным _id не найден.'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new DataError('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.name === 'CastError') {
        return next(new DataError('Пользователь с указанным _id не найден.'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new EmailOrPasswordError('Неправильная почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new EmailOrPasswordError('Неправильная почта или пароль');
          }
          return user;
        });
    })
    .then((user) => {
      return {
        token: createToken({ _id: user._id }),
        user
      }
    })

    .then((data) => {
      res.cookie('jwt', data.token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });

      return res.send( data.user );
    })
    .catch((err) => {
      if (err.statusCode === EMAIL_OR_PASSWORD_ERROR_CODE) {
        return next(new EmailOrPasswordError(err.message));
      }
      return next(err);
    });
};
