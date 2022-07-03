const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

const createToken = (payload) => jwt.sign(
  payload,
  NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  { expiresIn: '7d' },
);

const checkToken = (token) => jwt.verify(
  token,
  NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
);

module.exports = { checkToken, createToken };
