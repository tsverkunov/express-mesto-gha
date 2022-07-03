const DATA_ERROR_CODE = 400;
const EMAIL_OR_PASSWORD_ERROR_CODE = 401;
const ONLY_OWNER_ERROR_CODE = 403;
const NOT_FOUND_ERROR_CODE = 404;
const DUPLICATE_EMAIL_ERROR_CODE = 409;
const ERROR_CODE = 500;
const MONGO_DUPLICATE_ERROR_CODE = 11000;

/* eslint-disable no-console, no-control-regex */
const regEx = /http(s)?:\/\/.(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g;

module.exports = {
  DATA_ERROR_CODE,
  EMAIL_OR_PASSWORD_ERROR_CODE,
  ONLY_OWNER_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DUPLICATE_EMAIL_ERROR_CODE,
  ERROR_CODE,
  MONGO_DUPLICATE_ERROR_CODE,
  regEx,
};
