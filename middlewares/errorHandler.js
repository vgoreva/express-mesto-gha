const { HTTP_STATUS_INTERNAL_SERVSR_ERROR } = require('http2').constants;

const handleError = (err, req, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVSR_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === HTTP_STATUS_INTERNAL_SERVSR_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
};

module.exports = handleError;
