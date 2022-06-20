const User = require('../models/user')

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send({data: users}))
    .catch(err => res.status(500).send({message: err.message}))
}

module.exports.getUser = (req, res) => {
  User.findById(req.param.userId)
    .then(user => res.status(200).send({data: user}))
    .catch(err => res.status(500).send({message: err.message}))
}

module.exports.createUser = (req, res) => {
  console.log(req.body)
  const {name, about, avatar} = req.body
  User.create({name, about, avatar})
    .then(user => res.status(200).send({data: user}))
    .catch(err => res.status(500).send({message: err.message}))
}