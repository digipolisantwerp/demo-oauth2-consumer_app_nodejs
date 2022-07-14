const { v4: uuidv4 } = require('uuid');

function getDgpCorrelation() {
  const id = uuidv4();
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
