const { checkToken } = require('../utils/jwt');
const EmailOrPasswordError = require('../errors/EmailOfPasswordError');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(req.cookies.jwt)
  if (!token) {
    throw new EmailOrPasswordError('Необходимо авторизоваться');
  }

  let payload;
  try {
    payload = checkToken(token);
  } catch (err) {
    next(new EmailOrPasswordError('Необходимо авторизоваться'));
  }
  req.user = payload;

  next();
};


// module.exports.auth = (req, res, next) => {
//   const { authorization } = req.headers;
//   console.log(authorization)
//   console.log(req.cookies)
//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     throw new EmailOrPasswordError('Необходимо авторизоваться');
//   }
//
//   const token = authorization.replace('Bearer ', '');
//   let payload;
//   try {
//     payload = checkToken(token);
//   } catch (err) {
//     next(new EmailOrPasswordError('Необходимо авторизоваться'));
//   }
//   req.user = payload;
//
//   next();
// };
