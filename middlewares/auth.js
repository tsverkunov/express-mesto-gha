const { EMAIL_OR_PASSWORD_ERROR_CODE } = require('../utils/constants');
const { checkToken } = require('../helpers/jwt');

module.exports.auth = (req, res, next) => {
  const auth = req.headers.cookie;
  if (!auth) {
    return res
      .status(EMAIL_OR_PASSWORD_ERROR_CODE)
      .send({ message: 'Необходимо авторизоваться' });
  }
  const token = auth.replace('jwt=', '');

  try {
    req.user = checkToken(token);
  } catch (err) {
    res
      .status(EMAIL_OR_PASSWORD_ERROR_CODE)
      .send({ message: 'Необходимо авторизоваться' });
  }
  next();
};