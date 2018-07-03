'use strict';

module.exports = {
  consent: {
    uri: {
      scheme: process.env.SERVICE_CONSENT_URI_SCHEME || 'https',
      domain: process.env.SERVICE_CONSENT_URI_DOMAIN || 'localhost:4000',
      path: '/v1/authorize?'
    }
  },
  fasdatastore: {
    uri: {
      scheme: process.env.SERVICE_fasdatastore_URI_SCHEME || 'https',
      domain: process.env.SERVICE_fasdatastore_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/fasdatastore/v1',
      api_key: process.env.SERVICE_fasdatastore_API_KEY || 'YOUR_API_KEY',
    },
    auth: {
      response_type: 'code',
      service: process.env.SERVICE_FASDATASTORE_AUTH_SERVICE || 'acpaas.fasdatastore.v1',
      client_id: process.env.SERVICE_FASDATASTORE_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_FASDATASTORE_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'name',
      redirect_uri: process.env.SERVICE_FASDATASTORE_AUTH_REDIRECT_URI || 'YOUR_REDIRECT_URI',
    },
  },
  aprofiel: {
    uri: {
      scheme: process.env.SERVICE_APROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_APROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/astad/aprofiel/v1/v1'
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
      path: '/astad/mprofiel/v1/v1'
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
  logout_redirect_uri: process.env.LOGOUT_REDIRECT_URI || 'http://localhost:3000/logoutCallback',
};
