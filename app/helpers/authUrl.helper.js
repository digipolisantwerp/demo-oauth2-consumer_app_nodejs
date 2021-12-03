const { cloneDeep } = require('lodash');
const querystring = require('querystring');
const servicesConfig = require('../../config/services.conf');
const logoutUtil = require('../utils/logout');

function createAuthorizeUrl(type) {
  const envConfig = cloneDeep(servicesConfig);
  const configOauth = { ...envConfig[type].auth };
  let url = `${envConfig.consent.uri.scheme}://${envConfig.consent.uri.domain}/${configOauth.version}${envConfig.consent.uri.path}`;
  configOauth.lng = 'nl';
  configOauth.state = '32042809';
  delete configOauth.client_secret;
  delete configOauth.version;
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

function getLoginTypes() {
  return servicesConfig.loginTypeKeys.map((key) => ({
    key,
    title: servicesConfig[key].title,
    url: createAuthorizeUrl(key),
  }));
}

module.exports = {
  createLogoutUrl,
  createAuthorizeUrl,
  getLoginTypes,
};
