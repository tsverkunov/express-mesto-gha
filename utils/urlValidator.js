module.exports.urlValidation = (url, helpers) => {
  const regex = /http(s)?:\/\/(www)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  if (regex.test(url)) {
    return url;
  }
  return helpers.error('Ссылка не валидна');
};
