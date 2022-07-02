const mongoose = require('mongoose');
const validator = require('validator');
const regex = /\w+@\w+\.\w+/gi;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator: (email) => isEmail(email),
    // },
  },
  password: {
    type: String,
    required: true,
  },
});

// userSchema.statics.findUserByCredentials = function (email, password) {
//   this.findOne({ email })
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error('Неправильная почта или пароль'));
//       }
//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             return Promise.reject(new Error('Неправильная почта или пароль'));
//           }
//
//           return user;
//         });
//     });
// };

module.exports = mongoose.model('user', userSchema);
