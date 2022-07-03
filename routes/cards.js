const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCards,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      link: Joi.string().required(),
    }),
  }),
  createCards,
);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);

module.exports = router;
