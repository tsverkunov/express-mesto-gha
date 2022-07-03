const Card = require('../models/card');
const DataError = require('../utils/errors');
const OwnerError = require('../utils/errors');
const NotFoundError = require('../utils/errors');

module.exports.getCards = (req, res, next) => {
  Card.find(
    {},
  )
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.createCards = (req, res, next) => {
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
        return next(new DataError('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(
    req.params.cardId,
  )
    .then((card) => {
      if (String(card.owner) !== String(req.user._id)) {
        throw new OwnerError('Вы не можете удалить чужую карточку.');
      }
    })
    .then(() => {
      Card.findByIdAndRemove(
        req.params.cardId,
      )
        .then((card) => {
          if (!card) {
            throw new NotFoundError('Карточка с указанным _id не найдена.');
          }
          return res.send({ card });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new DataError('Карточка с указанным _id не найдена.'));
          }
          next(err);
        });
    })
    .catch((err) => next(new OwnerError(err.message)),
    );
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (!like) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res.send({ like });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new DataError('Переданы некорректные данные для снятии/постановки лайка.'));
      }
      if (err.name === 'CastError') {
        return next(new DataError('Передан несуществующий _id карточки'));
      }
      next(err);
    });
};

module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (!like) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res.send({ like });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new DataError('Переданы некорректные данные для снятии/постановки лайка.'));
      }
      if (err.name === 'CastError') {
        return next(new DataError('Передан несуществующий _id карточки'));
      }
      next(err);
    });
};
