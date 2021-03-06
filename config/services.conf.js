module.exports = {
  consent: {
    uri: {
      scheme: process.env.SERVICE_CONSENT_URI_SCHEME || 'http',
      domain: process.env.SERVICE_CONSENT_URI_DOMAIN || 'localhost:4000',
      domain_consent2: process.env.SERVICE_CONSENT2_URI_DOMAIN || 'localhost:4000',
      path: '/authorize?',
    },
    api: {
      url: process.env.SERVICE_CONSENT_API_URL || 'https://api-gw-o.antwerpen.be/acpaas/consent/v1',
      key: process.env.SERVICE_CONSENT_API_KEY || '<your-api-key>',
      client_id: process.env.SERVICE_CONSENT_API_CLIENT_ID || '<clientid>',
      client_secret: process.env.SERVICE_CONSENT_API_CLIENT_SECRET || '<clientid>',
    },
  },
  fasdatastore: {
    title: 'eID',
    uri: {
      scheme: process.env.SERVICE_FASDATASTORE_URI_SCHEME || 'https',
      domain: process.env.SERVICE_FASDATASTORE_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/fasdatastore/v1',
    },
    auth: {
      version: 'v1',
      response_type: 'code',
      service: process.env.SERVICE_FASDATASTORE_AUTH_SERVICE || 'acpaas.fasdatastore.v1',
      client_id: process.env.SERVICE_FASDATASTORE_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_FASDATASTORE_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'name nationalregistrationnumber',
      redirect_uri: process.env.SERVICE_FASDATASTORE_AUTH_REDIRECT_URI || 'YOUR_REDIRECT_URI',
    },
  },
  digipolisgentdatastore: {
    title: 'Digipolis Gent',
    uri: {
      scheme: process.env.SERVICE_GENTDATASTORE_URI_SCHEME || 'https',
      domain: process.env.SERVICE_GENTDATASTORE_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/digipolis/gentdatastore/v1',
    },
    auth: {
      version: 'v1',
      response_type: 'code',
      service: process.env.SERVICE_GENTDATASTORE_AUTH_SERVICE || 'digipolis.gentdatastore.v1',
      client_id: process.env.SERVICE_GENTDATASTORE_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_GENTDATASTORE_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'name nationalregistrationnumber',
      redirect_uri: process.env.SERVICE_GENTDATASTORE_AUTH_REDIRECT_URI || 'YOUR_REDIRECT_URI',
    },
  },
  profiel: {
    title: 'Authentication 2.0',
    uri: {
      scheme: process.env.SERVICE_PROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_PROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/shared-identity-data/v1',
    },
    auth: {
      version: 'v2',
      response_type: 'code',
      consent_required: 'false',
      minimal_assurance_level: 'low',
      auth_methods: process.env.SERVICE_PROFIEL_AUTH_METHODS || 'fas-citizen-bmid,fas-citizen-eid,fas-citizen-totp,fas-citizen-otp,iam-aprofiel-userpass',
      client_id: process.env.SERVICE_PROFIEL_ACM_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_PROFIEL_ACM_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'astad.aprofiel.v1.username astad.aprofiel.v1.name astad.aprofiel.v1.avatar astad.aprofiel.v1.email astad.aprofiel.v1.phone',
      redirect_uri: process.env.SERVICE_PROFIEL_ACM_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/profiel',
    },
  },
  pza: {
    title: 'PZA',
    uri: {
      scheme: process.env.SERVICE_PZA_URI_SCHEME || 'https',
      domain: process.env.SERVICE_PZA_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/pza/v1',
    },
    auth: {
      version: 'v1',
      response_type: 'code',
      auth_type: 'pza',
      service: process.env.SERVICE_PZA_AUTH_SERVICE || 'acpaas.pzadatastore.v1',
      client_id: process.env.SERVICE_PZA_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_PZA_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'all',
      redirect_uri: process.env.SERVICE_PZA_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/pza',
    },
  },
  profiel_enterprise: {
    title: 'Authentication 2.0 - Enterprise',
    uri: {
      scheme: process.env.SERVICE_PROFIEL_ENTERPRISE_URI_SCHEME || 'https',
      domain: process.env.SERVICE_PROFIEL_ENTERPRISE_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/shared-identity-data/v1',
    },
    auth: {
      version: 'v2',
      response_type: 'code',
      minimal_assurance_level: 'low',
      auth_methods: process.env.SERVICE_PROFIEL_ENTERPRISE_AUTH_METHODS || 'fas-enterprise-bmid,fas-enterprise-eid,fas-enterprise-totp,fas-enterprise-otp',
      client_id: process.env.SERVICE_PROFIEL_ENTERPRISE_ACM_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_PROFIEL_ENTERPRISE_ACM_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'astad.aprofiel.v1.username astad.aprofiel.v1.name astad.aprofiel.v1.avatar astad.aprofiel.v1.email astad.aprofiel.v1.phone',
      redirect_uri: process.env.SERVICE_PROFIEL_ENTERPRISE_ACM_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/profiel',
    },
  },
  profiel_hintedlogin: {
    title: 'Authentication 2.0 - Hintedlogin',
    uri: {
      scheme: process.env.SERVICE_PROFIEL_HINTED_URI_SCHEME || 'https',
      domain: process.env.SERVICE_PROFIEL_HINTED_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/shared-identity-data/v1',
    },
    auth: {
      version: 'v2',
      response_type: 'code',
      minimal_assurance_level: 'low',
      auth_methods: process.env.SERVICE_PROFIEL_HINTED_AUTH_METHODS || 'fas-hintedlogin-bmid,fas-hintedlogin-eid,fas-hintedlogin-totp,fas-hintedlogin-otp',
      client_id: process.env.SERVICE_PROFIEL_HINTED_ACM_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_PROFIEL_HINTED_ACM_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'astad.aprofiel.v1.username astad.aprofiel.v1.name astad.aprofiel.v1.avatar astad.aprofiel.v1.email astad.aprofiel.v1.phone',
      redirect_uri: process.env.SERVICE_PROFIEL_HINTED_ACM_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/profiel',
    },
  },
  aprofiel: {
    title: 'A-Profiel',
    uri: {
      scheme: process.env.SERVICE_APROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_APROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/astad/aprofiel/v1/v1',
    },
    auth: {
      version: 'v1',
      response_type: 'code',
      service: process.env.SERVICE_APROFIEL_AUTH_SERVICE || 'astad.aprofiel.v1',
      client_id: process.env.SERVICE_APROFIEL_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_APROFIEL_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'astad.aprofiel.v1.username astad.aprofiel.v1.name astad.aprofiel.v1.avatar astad.aprofiel.v1.email astad.aprofiel.v1.phone',
      redirect_uri: process.env.SERVICE_APROFIEL_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/aprofiel',
    },
  },
  mprofiel: {
    title: 'M-Profiel',
    uri: {
      scheme: process.env.SERVICE_MPROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_MPROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/astad/mprofiel/v1/v1',
    },
    auth: {
      version: 'v1',
      response_type: 'code',
      auth_type: 'form',
      service: process.env.SERVICE_MPROFIEL_AUTH_SERVICE || 'astad.mprofiel.v1',
      client_id: process.env.SERVICE_MPROFIEL_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_MPROFIEL_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'all',
      redirect_uri: process.env.SERVICE_MPROFIEL_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/mprofiel',
    },
  },
  soprofiel: {
    title: 'SO-Profiel',
    uri: {
      scheme: process.env.SERVICE_SOPROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_SOPROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/astad/mprofiel/v1/v1',
    },
    auth: {
      version: 'v1',
      response_type: 'code',
      auth_type: 'so',
      service: process.env.SERVICE_MPROFIEL_AUTH_SERVICE || 'astad.mprofiel.v1',
      client_id: process.env.SERVICE_SOPROFIEL_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_SOPROFIEL_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'all',
      redirect_uri: process.env.SERVICE_SOPROFIEL_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/soprofiel',
    },
  },
  zorgbedrijf: {
    title: 'Zorgbedrijf',
    uri: {
      scheme: process.env.SERVICE_ZORGBEDRIJF_URI_SCHEME || 'https',
      domain: process.env.SERVICE_ZORGBEDRIJF_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/astad/mprofiel/v1/v1',
    },
    auth: {
      version: 'v1',
      response_type: 'code',
      auth_type: 'zorgbedrijf',
      service: process.env.SERVICE_MPROFIEL_AUTH_SERVICE || 'astad.mprofiel.v1',
      client_id: process.env.SERVICE_ZORGBEDRIJF_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_ZORGBEDRIJF_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'all',
      redirect_uri: process.env.SERVICE_ZORGBEDRIJF_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/zorgbedrijf',
    },
  },
  provantprofiel: {
    title: 'Provincie Antwerpen Profiel',
    uri: {
      scheme: process.env.SERVICE_PROVANTPROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_PROVANTPROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/provantprofiel/v1',
    },
    auth: {
      version: 'v1',
      response_type: 'code',
      service: process.env.SERVICE_PROVANTPROFIEL_AUTH_SERVICE || 'acpaas.provantprofiel.v1',
      client_id: process.env.SERVICE_PROVANTPROFIEL_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_PROVANTPROFIEL_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'all',
      redirect_uri: process.env.SERVICE_PROVANTPROFIEL_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/provantprofiel',
    },
  },
  logout_redirect_uri: process.env.LOGOUT_REDIRECT_URI || 'http://localhost:3000/logoutCallback',
};
