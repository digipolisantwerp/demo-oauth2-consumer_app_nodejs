'use strict';

module.exports = {
  environment: ENVIRONMENT || 'development',
  port: PORT || 3000,
  consent: {
    uri: {
      scheme: SERVICE_CONSENT_URI_SCHEME || 'https',
      domain: SERVICE_CONSENT_URI_DOMAIN || 'api-oauth2-o.antwerpen.be',
      path: '/v1/authorize?'
    }
  },
  aprofiel: {
    uri: {
      scheme: SERVICE_APROFIEL_URI_SCHEME || 'https',
      domain: SERVICE_APROFIEL_URI_DOMAIN || 'api-gw-p.antwerpen.be',
      path: '/astad/aprofiel/v1'
    },
    auth: {
      response_type: 'code',
      service: SERVICE_APROFIEL_AUTH_SERVICE  || 'astad.aprofiel.v1',
      client_id: SERVICE_APROFIEL_AUTH_CLIENT_ID  || 'YOUR_CLIENT_ID',
      client_secret: SERVICE_APROFIEL_AUTH_CLIENT_SECRET  || 'YOUR_CLIENT_SECRET',
      scope: 'astad.aprofiel.v1.username astad.aprofiel.v1.name astad.aprofiel.v1.avatar astad.aprofiel.v1.email astad.aprofiel.v1.phone',
      redirect_uri: SERVICE_APROFIEL_AUTH_REDIRECT_URI  ||'YOUR_REDIRECT_URI'
    }
  },
  mprofiel: {
    uri: {
      scheme: SERVICE_MPROFIEL_URI_SCHEME || 'https',
      domain: SERVICE_MPROFIEL_URI_SCHEME || 'api-gw-p.antwerpen.be',
      path: '/astad/mprofiel/v1'
    },
    auth: {
      response_type: 'code',
      service: SERVICE_MPROFIEL_AUTH_SERVICE || 'astad.mprofiel.v1',
      client_id: SERVICE_MPROFIEL_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: SERVICE_MPROFIEL_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'all',
      redirect_uri: SERVICE_MPROFIEL_AUTH_REDIRECT_URI || 'YOUR_REDIRECT_URI'
    }
  }
};
