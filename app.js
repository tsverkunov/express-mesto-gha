require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOT_FOUND_ERROR_CODE } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('mongoose connected'))
  .catch((e) => console.log(e));

app.use((req, res, next) => {
  req.user = {
    _id: '62b0647cb0999f65a8594d74', // _id созданного пользователя
  };

  next();
});


app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));
app.post('/signin', auth, login);
app.post('/signup', createUser);

app.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
