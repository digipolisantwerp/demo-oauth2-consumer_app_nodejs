const request = require('request');
const config = require('../../config/services.conf.js');

function getTokenConsent() {
  return new Promise((resolve, reject) => {
    if (config.consent.api.url.includes('localhost')) {
      return resolve('');
    }
    return request.post({
      url: `${config.consent.api.url}/oauth2/token`,
      json: true,
      body: {
        client_id: config.consent.api.client_id,
        client_secret: config.consent.api.client_secret,
        grant_type: 'client_credentials',
      },
    }, (error, response, body) => {
      if (error) {
        console.log('Something went wrong in getSessions', error);
        return reject(error);
      }
      return resolve(body.access_token);
    });
  });
}

module.exports = {
  getTokenConsent,
};
