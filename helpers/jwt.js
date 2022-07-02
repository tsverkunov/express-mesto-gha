const jwt = require('jsonwebtoken');
const {JWT_SECRET, NODE_ENV} = process.env

const createToken = (payload) => {
  return jwt.sign(
    payload,
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    { expiresIn: '7d' },
  );
}

const checkToken = (token) => {
  return jwt.verify(
    token,
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret')
}

module.exports = { checkToken, createToken }