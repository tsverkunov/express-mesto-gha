const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCards,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');
const { urlValidation } = require('../utils/urlValidator');

router.get('/', getCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(urlValidation),
    }),
  }),
  createCards,
);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  deleteCard,
);
router.put(
  '/:cardId/likes',
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  addLike,
);
router.delete(
  '/:cardId/likes',
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  removeLike,
);

module.exports = router;
