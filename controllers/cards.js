const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

const Created = 201;
const BadRequest = 400;
const NotFound = 404;
const NotImlemented = 500;

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(Created).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(BadRequest).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(NotImlemented).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(NotImlemented).send({ message: 'На сервере произошла ошибка.' }));
};

module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          res.status(NotFound).send({ message: 'Карточка с указанным _id не найдена.' });
          return;
        }
        res.send({ message: 'Карточка удалена.' });
      })
      .catch(() => res.status(NotFound).send({ message: 'Карточка с указанным _id не найдена.' }));
  } else {
    res.status(BadRequest).send({ message: 'Переданы некорректные данные при создании карточки.' });
  }
};

module.exports.likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(NotFound).send({ message: 'Карточка с указанным _id не найдена.' });
          return;
        }
        res.send(card);
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(BadRequest).send({ message: 'Передан несуществующий _id карточки.' });
        } else {
          res.status(NotImlemented).send({ message: 'На сервере произошла ошибка' });
        }
      });
  } else {
    res.status(BadRequest).send({ message: 'Переданы некорректные данные для постановки лайка.' });
  }
};

module.exports.dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(NotFound).send({ message: 'Карточка с указанным _id не найдена.' });
          return;
        }
        res.send(card);
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(BadRequest).send({ message: 'Передан несуществующий _id карточки.' });
        } else {
          res.status(NotImlemented).send({ message: 'На сервере произошла ошибка' });
        }
      });
  } else {
    res.status(BadRequest).send({ message: 'Переданы некорректные данные для снятия лайка.' });
  }
};
