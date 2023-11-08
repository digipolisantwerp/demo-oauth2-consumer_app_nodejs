const crypto = require('crypto');

function getDgpCorrelation() {
  const id = crypto.randomUUID();
  const dgpCorrelation = {
    id,
    sourceId: process.env.SOURCEID_CORRELATION,
    sourceName: process.env.SOURCE_CORRELATION,
  };
  return Buffer.from(JSON.stringify(dgpCorrelation)).toString('base64');
}

module.exports = {
  getDgpCorrelation,
};
