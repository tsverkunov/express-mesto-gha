const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const {PORT = 3000} = process.env

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
)
  .then(()=>console.log('mongoose connected'))
  .catch(e=>console.log(e));

app.use((req, res, next) => {
  req.user = {
    _id: '62b0647cb0999f65a8594d74' // _id созданного пользователя
  };

  next();
});

app.use('/cards', require('./routes/cards'))
app.use('/users', require('./routes/users'))

// app.use((req, res) => {
//   res.status(404).send({ message: 'Страница не найдена' });
// });


app.listen(PORT)

