const errors = require('../errors/index');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let returnError = err;
  let meta = undefined;
  if (process.env.NODE_ENV === 'development') {
    meta = {
      stack: err.stack,
    };
    if (err.error === 'Bad Request' || (err.message === 'validation error' && err.name === 'ValidationError')) {
      meta = err.errors;
    }
  }
  if (err.message === 'validation error' || err.name === 'ValidationError') {
    returnError = errors.badRequest({
      title: err.field ? err.field : 'Validation Error',
      identifier: req.id,
      detail: err.details || '',
      type: req.originalUrl,
      meta,
    });
  }
  if (returnError.status) {
    return res.status(returnError.status).send({
      ...returnError,
      identifier: req.id,
      code: err.status || -1,
      type: req.originalUrl,
    });
  }
  return res.status(500).send(errors.internalServerError({
    title: 'Something went wrong',
    type: req.originalUrl,
    detail: returnError.message,
    identifier: req.id,
    code: '-1',
    meta,
  }));
}

module.exports = errorHandler;
