const allowedCors = [
  'http://tsverkunov.mesto.students.nomorepartiesxyz.ru',
  'https://tsverkunov.mesto.students.nomorepartiesxyz.ru',
  'http://tsverkunov-mesto-b.nomorepartiesxyz.ru',
  'https://tsverkunov-mesto-b.nomorepartiesxyz.ru',
  'localhost:3000',
];

module.exports.cors = (req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-allow-origin'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next()
}