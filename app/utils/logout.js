'use strict';

var querystring = require('querystring');
var crypto = require('crypto');
var algorithm = 'aes-128-ctr';

function encrypt(text, password) {
  console.log(text, password);

  var hash = crypto.createHash('sha1');
  hash.update(password);
  var key = hash.digest().slice(0, 16);
  var ivBuffer = Buffer.alloc(16);
  var cipher = crypto.createCipheriv(algorithm, key, ivBuffer);
  var crypted = cipher.update(text, 'utf8', 'hex');
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

  var data = JSON.stringify({
    user_id: options.user_id,
    access_token: options.access_token,
    redirect_uri: options.redirect_uri,
  });
  var queryObject = {
    client_id: options.client_id,
    service: options.service,
    data: encrypt(data, options.client_secret),
  };

  return options.host + options.path + '?' + querystring.stringify(queryObject);
}

module.exports = {
  createLogoutUri: createLogoutUri,
};
