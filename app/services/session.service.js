const request = require('request');
const config = require('../../config/services.conf.js');
const tokenHelper = require('../helpers/token.helper');

function getSession(ssokey, clientId) {
  return new Promise((resolve, reject) => {
    if (!ssokey) {
      return reject(new Error('no cookie set'));
    }
    return tokenHelper.getTokenConsent().then(token => request({
      url: `${config.consent.api.url}/sessions/${ssokey}/${clientId}`,
      json: true,
      headers: { authorization: `Bearer ${token}` },
    }, (error, response, body) => {
      if (error) {
        console.log('Something went wrong in getSession', error);
        return reject(error);
      }
      return resolve(body);
    }));
  });
}

function getSessions(ssokey) {
  return new Promise((resolve, reject) => {
    if (!ssokey) {
      return reject(new Error('no cookie set'));
    }
    return tokenHelper.getTokenConsent().then((token) => {
      request({
        url: `${config.consent.api.url}/sessions/${ssokey}`,
        json: true,
        headers: { authorization: `Bearer ${token}` },
      }, (error, response, body) => {
        if (error) {
          console.log('Something went wrong in getSessions', error);
          return reject(error);
        }
        return resolve(body);
      });
    });
  });
}

module.exports = {
  getSessions,
  getSession,
};
