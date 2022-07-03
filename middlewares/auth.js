const { EMAIL_OR_PASSWORD_ERROR_CODE } = require('../utils/constants');
const { checkToken } = require('../utils/jwt');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(EMAIL_OR_PASSWORD_ERROR_CODE)
      .send({ message: 'Необходимо авторизоваться' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = checkToken(token);
  } catch (err) {
    res
      .status(EMAIL_OR_PASSWORD_ERROR_CODE)
      .send({ message: 'Необходимо авторизоваться' });
  }
  req.user = payload;

  next();
};