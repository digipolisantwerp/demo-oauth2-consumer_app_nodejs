const axios = require('axios');

const config = require('../../config/services.conf');

async function getTokenConsent() {
  try {
    if (config.consent.api.url.includes('localhost')) return '';

    const { data } = await axios.post(`${config.consent.api.url}/oauth2/token`, {
      client_id: config.consent.api.client_id,
      client_secret: config.consent.api.client_secret,
      grant_type: 'client_credentials',
    });

    return data.access_token;
  } catch (e) {
    console.log('Something went wrong in getTokenConsent', e);
    throw (e);
  }
}

module.exports = {
  getTokenConsent,
};
