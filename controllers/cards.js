const Card = require('../models/card');
const {
  DATA_ERROR_CODE,
  ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find(
    {},
  )
    .then((cards) => res.send({ cards }))
    .catch(() => res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка.' }));
};

module.exports.createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create(
    {
      name, link, owner,
    },
  )
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(
    req.params.cardId,
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка.' });
    });
};

function handleLike(req, res) {
  ((like) => {
    if (!like) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send({ like });
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные для снятии/постановки лайка.' });
      }
      if (err.name === 'CastError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка.' });
    });
}

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(() => handleLike(req, res));
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(() => handleLike(req, res));
};
