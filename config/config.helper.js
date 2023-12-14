function setBooleanValue(value, defaultValue = false) {
  if (value !== undefined) {
    if (value === 'true' || value === true) {
      return true;
    }
    if (value === 'false' || value === false) {
      return false;
    }
  }
  if (defaultValue === 'true' || defaultValue === true) {
    return true;
  }
  return false;
}

module.exports = {
  setBooleanValue,
};
