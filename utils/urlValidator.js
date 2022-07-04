const { regExpLink } = require('./constants');

module.exports.urlValidation = (url, helpers) => {
  // const regex = /https?:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  if (regExpLink.test(url)) {
    return url;
  }
  return helpers.error('Ссылка не валидна');
};
