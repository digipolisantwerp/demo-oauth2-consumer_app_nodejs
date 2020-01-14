const crypto = require('crypto');
const algorithm = 'aes-128-ctr';

function serialize(obj, prefix) {
  const str = [];
  let p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p,
        v = obj[p];
      str.push((v !== null && typeof v === "object") ?
        serialize(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}

function encrypt(text, password) {
  const hash = crypto.createHash('sha1');
  hash.update(password);
  const key = hash.digest().slice(0, 16);
  const ivBuffer = Buffer.alloc(16);
  const cipher = crypto.createCipheriv(algorithm, key, ivBuffer);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/*
  Create a logout uri

  options properties:
  - host
  - path
  - user_id
  - access_token
  - redirect_uri
  - service
  - client_id
  - client_secret
*/
/**
 * Create a logout uri
 *
 * @param {Object} options
 * @param {string} options.host
 * @param {string} options.path
 * @param {string} options.user_id
 * @param {string} options.access_token
 * @param {string} options.redirect_uri
 * @param {string} options.service
 * @param {string} options.client_id
 * @param {string} options.client_secret
 */
function createLogoutUri(options) {
  const data = JSON.stringify({
    user_id: options.user_id,
    access_token: options.access_token,
    redirect_uri: options.redirect_uri,
  });
  const queryObject = {
    client_id: options.client_id,
    service: options.service,
    data: encrypt(data, options.client_secret),
  };
  if (options.method) {
    delete queryObject.service;
    queryObject.authenticationMethod = options.method;
  }
  if (options.auth_type) {
    queryObject.auth_type = options.auth_type;
  }
  return `${options.host}${options.path}?${serialize(queryObject)}`;
}

module.exports = {
  createLogoutUri,
};
