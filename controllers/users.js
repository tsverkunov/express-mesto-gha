const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DATA_ERROR_CODE,
  EMAIL_OR_PASSWORD_ERROR_CODE,
  DUPLICATE_ERROR_CODE,
  MONGO_DUPLICATE_ERROR_CODE,
} = require('../utils/constants');
const { createToken } = require('../helpers/jwt');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(DATA_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

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
        user,
        // user: {
        //   _id: user._id,
        //   name: user.name,
        //   about: user.about,
        //   avatar: user.avatar,
        //   email: user.email,
        // },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: err.message });
      }
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return res
          .status(DUPLICATE_ERROR_CODE)
          .send({ message: 'Email занят' });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'CastError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.name === 'CastError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильная почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильная почта или пароль'));
          }
          return user;
        });
    })
    .then((user) => {
      return createToken({ _id: user._id });
    })
    .then(token => {
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });

      return res.send(token);
    })
    .catch((err) => {
      if (err.statusCode === EMAIL_OR_PASSWORD_ERROR_CODE) {
        return res.status(EMAIL_OR_PASSWORD_ERROR_CODE).send({ message: err.message });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: 'На сервере произошла ошибка' });
    });
};


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmJmNTZhNDEyMWZkMTUzYmNhZmJjMjYiLCJpYXQiOjE2NTY3MTM4ODIsImV4cCI6MTY1NzMxODY4Mn0.Dy1zoNZULZbi0MnXeh3zkPF5KyFMDStM7HZ7Vx5uo1A
