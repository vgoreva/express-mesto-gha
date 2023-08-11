const { default: mongoose } = require('mongoose');
const User = require('../models/user');

const Created = 201;
const BadRequest = 400;
const NotFound = 404;
const NotImlemented = 500;

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(Created).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(BadRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(NotImlemented).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(NotImlemented).send({ message: 'На сервере произошла ошибка.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NotFound).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequest).send({ message: 'Передан некоректный _id.' });
      } else {
        res.status(NotImlemented).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(BadRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        } else {
          res.status(NotImlemented).send({ message: 'На сервере произошла ошибка' });
        }
      });
  } else {
    res.status(BadRequest).send({ message: 'Передан некоректный _id.' });
  }
};

module.exports.editUserAvatar = (req, res) => {
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(BadRequest).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        } else {
          res.status(NotImlemented).send({ message: 'На сервере произошла ошибка' });
        }
      });
  } else {
    res.status(BadRequest).send({ message: 'Передан некоректный _id.' });
  }
};
