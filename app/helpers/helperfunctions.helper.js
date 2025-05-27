function pick(object, keys) {
  let o = { ...object };
  if (typeof object.toJSON === 'function') {
    o = object.toJSON();
  }
  return keys.reduce((obj, key) => {
    // eslint-disable-next-line
    if (o && o.hasOwnProperty(key)) {
    // eslint-disable-next-line
      obj[key] = o[key];
    }
    return obj;
  }, {});
}

function isArray(a) {
  return Array.isArray(a);
}

module.exports = {
  isArray,
  pick,
};
