const User = require('../models/user')
const {ERROR_CODE, NOT_FOUND_ERROR_CODE, DATA_ERROR_CODE, OK} = require('../utils/constants')

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(OK).send({ users }))
    .catch(() => res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка'}))
}

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if(!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({message: 'Пользователь по указанному _id не найден.'})
      }
      return res.status(OK).send({ user })
    })
    .catch(err => {
      if(err.name === 'CastError') {
        return res.status(DATA_ERROR_CODE).send({message: 'Пользователь по указанному _id не найден.'})
      }
      return res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка'})
    })
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body
  User.create({name, about, avatar})
    .then(user => res.status(OK).send({ user }))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({message: 'Переданы некорректные данные при создании пользователя.'})
      }
       return res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка'})
    })
}

module.exports.updateProfile = (req, res) => {
  const {name} = req.body
  User.findByIdAndUpdate(req.user._id, {name},     {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true // данные будут валидированы перед изменением
  })
    .then(user => res.status(OK).send({ user }))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({message: 'Переданы некорректные данные при обновлении профиля.'})
      }
      if(err.name === 'CastError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({message: 'Пользователь с указанным _id не найден.'})
      }
       return res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка'})
    })
}

module.exports.updateAvatar = (req, res) => {
  const {link} = req.body
  User.findByIdAndUpdate(req.user._id, {avatar: link}, {
    new: true,
    runValidators: true
  })
    .then(user => res.status(OK).send({ user }))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({message: 'Переданы некорректные данные при обновлении аватара.'})
      }
      if(err.name === 'CastError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({message: 'Пользователь с указанным _id не найден.'})
      }
      return res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка'})
    })
}