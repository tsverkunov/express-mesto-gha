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
).then(()=>console.log('connected'))
  .catch(e=>console.log(e));

app.use('/cards', require('./routes/cards'))
app.use('/users', require('./routes/users'))


app.listen(PORT)