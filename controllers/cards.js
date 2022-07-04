const Card = require('../models/card');
const DataError = require('../errors/DataError');
const OwnerError = require('../errors/OwnerError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find(
    {},
  )
    .then((cards) => {
      if (!cards) {
        throw new DataError('Карточки не получены.');
      }
      res.send({ cards });
    })
    .catch(next);
};

module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  // if (!name || !link) {
  //   throw new DataError('нет данных');
  // }
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

      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
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

          return next(err);
        });
    })
    .catch(
      (err) => next(new OwnerError(err.message)),
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
      return next(err);
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
      return next(err);
    });
};
