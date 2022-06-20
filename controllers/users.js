const User = require('../models/user')
const {ERROR_CODE, NOT_FOUND_ERROR_CODE, DATA_ERROR_CODE} = require('../utils/constants')

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send({data: users}))
    .catch(() => res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка'}))
}

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.status(200).send({data: user}))
    .catch(err => {
      console.log(err.name)
      if(err.name === 'CastError') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({message: 'Пользователь по указанному _id не найден.'})
      }
      res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка'})
    })
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body
  User.create({name, about, avatar})
    .then(user => res.status(200).send({data: user}))
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
    .then(profile => res.status(200).send({data: profile}))
    .catch(err => {
      console.log(err.name)
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
      res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка'})
    })
}

module.exports.updateAvatar = (req, res) => {
  const {link} = req.body
  User.findByIdAndUpdate(req.user._id, {avatar: link}, {
    new: true,
    runValidators: true
  })
    .then(avatar => res.status(200).send({data: avatar}))
    .catch(err => {
      console.log(err.name)
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
      res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка'})
    })
}