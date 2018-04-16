'use strict';

module.exports = {
  consent: {
    uri: {
      scheme: process.env.SERVICE_CONSENT_URI_SCHEME || 'https',
      domain: process.env.SERVICE_CONSENT_URI_DOMAIN || 'api-oauth2-o.antwerpen.be',
      path: '/v1/authorize?'
    }
  },
  aprofiel: {
    uri: {
      scheme: process.env.SERVICE_APROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_APROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/astad/aprofiel/v1'
    },
    auth: {
      response_type: 'code',
      service: process.env.SERVICE_APROFIEL_AUTH_SERVICE || 'astad.aprofiel.v1',
      client_id: process.env.SERVICE_APROFIEL_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_APROFIEL_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'astad.aprofiel.v1.username astad.aprofiel.v1.name astad.aprofiel.v1.avatar astad.aprofiel.v1.email astad.aprofiel.v1.phone',
      redirect_uri: process.env.SERVICE_APROFIEL_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/aprofiel',
    },
  },
  mprofiel: {
    uri: {
      scheme: process.env.SERVICE_MPROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_MPROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/astad/mprofiel/v1'
    },
    auth: {
      response_type: 'code',
      service: process.env.SERVICE_MPROFIEL_AUTH_SERVICE || 'astad.mprofiel.v1',
      client_id: process.env.SERVICE_MPROFIEL_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_MPROFIEL_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'all',
      redirect_uri: process.env.SERVICE_MPROFIEL_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/mprofiel',
    },
  },
  logout_redirect_uri: process.env.LOGOUT_REDIRECT_URI || 'http://localhost:3000/logout',
};
