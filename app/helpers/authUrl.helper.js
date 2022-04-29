const { cloneDeep } = require('lodash');
const querystring = require('querystring');
const servicesConfig = require('../../config/services.conf');
const logoutUtil = require('../utils/logout');

function createAuthorizeUrl(type, code_challenge, nonce) {
  const envConfig = cloneDeep(servicesConfig);
  const configOauth = { ...envConfig[type].auth };
  let url = `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain}/${configOauth.version}${envConfig.consent.uri.path}`;
  configOauth.lng = 'nl';
  configOauth.state = '32042809';
  configOauth.code_challenge = code_challenge;
  if (nonce) configOauth.nonce = nonce;
  delete configOauth.client_secret;
  delete configOauth.version;
  delete configOauth.tokenurl;
  url += querystring.stringify(configOauth);
  return url;
}

function createLogoutUrl(consentConfig, profileConfig, redirectUri, id, accessToken, authType) {
  const options = {
    host: `${consentConfig.uri.scheme}://${consentConfig.uri.domain}`,
    path: `/${profileConfig.auth.version}/logout/redirect/encrypted`,
    user_id: id,
    method: profileConfig.auth.method,
    access_token: accessToken,
    redirect_uri: redirectUri,
    service: profileConfig.auth.service,
    client_id: profileConfig.auth.client_id,
    client_secret: profileConfig.auth.client_secret,
  };
  if (authType && authType !== 'undefined') {
    options.auth_type = authType;
  }
  return logoutUtil.createLogoutUri(options);
}

function getLoginTypes(code_challenge, nonce) {
  return servicesConfig.loginTypeKeys.map((key) => {
    const setnonce = key.startsWith('keycloak') ? nonce : false;
    return ({
      key,
      title: servicesConfig[key].title,
      url: createAuthorizeUrl(key, code_challenge, setnonce),
    });
  });
}

module.exports = {
  createLogoutUrl,
  createAuthorizeUrl,
  getLoginTypes,
};
