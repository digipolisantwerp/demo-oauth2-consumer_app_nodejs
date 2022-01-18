function stringifyObject(json) {
  return JSON.stringify(json, null, 4);
}

module.exports = {
  stringifyObject,
};
