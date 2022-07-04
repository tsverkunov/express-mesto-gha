const { regExpLink } = require('./constants');

module.exports.urlValidation = (url, helpers) => {
  if (regExpLink.test(url)) {
    return url;
  }
  return helpers.error('Ссылка не валидна');
};
