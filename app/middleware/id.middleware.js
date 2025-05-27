const { randomUUID } = require('node:crypto');

function addRequestId(req, res, next) {
  req.id = randomUUID();
  return next();
}

module.exports = addRequestId;
