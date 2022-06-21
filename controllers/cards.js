const Card = require('../models/card')
const {DATA_ERROR_CODE, ERROR_CODE, NOT_FOUND_ERROR_CODE, OK} = require('../utils/constants')

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ cards }))
    .catch(() =>res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка.'}))
}

module.exports.createCards = (req, res) => {
  const {name, link} = req.body
  const owner = req.user._id
  const likes = []
  Card.create({name, link, owner, likes})
    .then(card => res.status(OK).send({ card }))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({message: 'Переданы некорректные данные при создании карточки.'})
      }
      return res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка.'})
    })
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({message: 'Карточка с указанным _id не найдена.'})
      }
      return res.status(OK).send({ card })
    })
    .catch(err => {
      if(err.name === 'CastError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({message: 'Карточка с указанным _id не найдена.'})
      }
      return res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка.'})
    })
}

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true,}
  )
    .then(like => {
      if (!like) {
        return res.status(NOT_FOUND_ERROR_CODE).send({message: 'Передан несуществующий _id карточки'})
      }
      return res.status(OK).send({ like })
    })
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({message: 'Переданы некорректные данные для постановки лайка.'})
      }
      if(err.name === 'CastError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({message: 'Передан несуществующий _id карточки'})
      }
      return res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка.'})
    })
}

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true,}
  )
    .then(like => {
      if (!like) {
        return res.status(NOT_FOUND_ERROR_CODE).send({message: 'Передан несуществующий _id карточки'})
      }
      return res.status(OK).send({ like })
    })
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({message: 'Переданы некорректные данные для снятии лайка.'})
      }
      if(err.name === 'CastError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({message: 'Передан несуществующий _id карточки'})
      }
      return res.status(ERROR_CODE).send({message: 'На сервере произошла ошибка.'})
    })
}