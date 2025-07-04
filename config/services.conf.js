const { createPrivateKey } = require('node:crypto');

function isBase64(str) {
  if (!str || str.trim() === '') return false;
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}

function parseBase64(variable) {
  let parsedVariable = variable;
  if (isBase64(parsedVariable)) {
    parsedVariable = atob(parsedVariable);
  }
  return parsedVariable;
}

const oauthConfig = {
  scope: 'openid profile email roles',
  clientId: process.env.MICROSOFT_CLIENT_ID,
  commonBaseUrl: 'https://login.windows.net/common',
  x5t: process.env.MICROSOFT_X5T || 'test',
  tenant: process.env.MICROSOFT_TENANT_ID,
  thumbprint: process.env.MICROSOFT_THUMBPRINT,
  privateKey: parseBase64(process.env.MICROSOFT_PRIVATEKEY),
};

const privateKeyObject = createPrivateKey({
  key: oauthConfig.privateKey,
  format: 'pem',
});

const privateKey = privateKeyObject.export({
  format: 'pem',
  type: 'pkcs8',
});


module.exports = {
  loginTypeKeys: [
    'profiel_keycloak',
    'profiel_keycloak_mobile_itmse',
    'profiel_keycloak_phone',
    'profiel_keycloak_email',
    'profiel',
    'aprofiel',
    'mprofiel',
    'cloudid',
    'fasdatastore',
    'soprofiel',
    'zorgbedrijf',
    'provantprofiel',
    'profiel_enterprise',
    'profiel_hintedlogin',
    'profiel_mandate',
    'entra',
  ],
  msalConfig: {
    auth: {
      clientId: oauthConfig.clientId,
      authority: `https://login.microsoftonline.com/${oauthConfig.tenant}`,
      clientCertificate: {
        thumbprint: oauthConfig.thumbprint,
        privateKey,
      },
    },
  },
  betaConsent: {
    uri: {
      scheme: process.env.SERVICE_BETA_CONSENT_URI_SCHEME || 'http',
      domain: process.env.SERVICE_BETA_CONSENT_URI_DOMAIN || 'localhost:4000',
      path: '/authorize?',
    },
  },
  consent: {
    uri: {
      scheme: process.env.SERVICE_CONSENT_URI_SCHEME || 'http',
      domain: process.env.SERVICE_CONSENT_URI_DOMAIN || 'localhost:4000',
      path: '/authorize?',
    },
    api: {
      url: process.env.SERVICE_CONSENT_API_URL || 'https://api-gw-o.antwerpen.be/acpaas/consent/v1',
      extra_header: process.env.SERVICE_CONSENT_EXTRA_HEADER || 'Content-Type',
      extra_header_value: process.env.SERVICE_CONSENT_EXTRA_HEADER_VALUE || 'application/json',
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
  profiel_keycloak_mobile_itmse: {
    title: 'Authentication 2.0 - OIDC - keycloak - itsme - for mobile ',
    uri: {
      scheme: process.env.SERVICE_PROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_PROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/shared-identity-data/v1',
      correlation: true,
    },
    auth: {
      version: 'v3',
      oidc_issuer: process.env.SERVICE_PROFIEL_KEYCLOAK_ACM_AUTH_ISSUER || '',
      response_type: 'code',
      // consent_required: 'false',
      minimal_assurance_level: 'substantial',
      auth_methods: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_MOBILE_ITSME_AUTH_METHOD || 'acm-bur-itsme-mobile',
      client_id: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_MOBILE_ITSME_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_MOBILE_ITSME_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_from keycloak',
      scope: 'astad.aprofiel.v1.username astad.aprofiel.v1.name astad.aprofiel.v1.avatar astad.aprofiel.v1.email astad.aprofiel.v1.phone',
      redirect_uri: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_MOBILE_ITSME_REDIRECT_URI || 'http://localhost:3000/callback/profiel_keycloak_mobile_itmse',
      tokenurl: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_MOBILE_ITSME_AUTH_TOKENURL || 'https://identity-o.digipolis.be/auth/realms/antwerpen',
    },
  },
  profiel_keycloak: {
    title: 'Authentication 2.0 - OIDC - keycloak',
    uri: {
      scheme: process.env.SERVICE_PROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_PROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/shared-identity-data/v1',
      correlation: true,
    },
    auth: {
      version: 'v3',
      oidc_issuer: process.env.SERVICE_PROFIEL_KEYCLOAK_ACM_AUTH_ISSUER || '',
      response_type: 'code',
      // consent_required: 'false',
      minimal_assurance_level: 'low',
      auth_methods: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHODS || 'fas-citizen-bmid,fas-citizen-eid,fas-citizen-totp,fas-citizen-otp,iam-aprofiel-userpass',
      client_id: process.env.SERVICE_PROFIEL_KEYCLOAK_ACM_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_PROFIEL_KEYCLOAK_ACM_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_from keycloak',
      scope: 'astad.aprofiel.v1.username',
      redirect_uri: process.env.SERVICE_PROFIEL_KEYCLOAK_ACM_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/profiel_keycloak',
      tokenurl: process.env.SERVICE_PROFIEL_KEYCLOAK_ACM_AUTH_TOKENURL || 'https://identity-o.digipolis.be/auth/realms/antwerpen',
    },
  },
  profiel_keycloak_phone: {
    title: 'Authentication 2.0 - OIDC - keycloak - phone - for mobile',
    uri: {
      scheme: process.env.SERVICE_PROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_PROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/shared-identity-data/v1',
      correlation: true,
    },
    auth: {
      version: 'v3',
      oidc_issuer: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_PHONE_ISSUER || '',
      response_type: 'code',
      // consent_required: 'false',
      minimal_assurance_level: 'low',
      auth_methods: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_PHONE || 'a-profiel-phone',
      // @TODO: put in env
      client_id: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_PHONE_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_PHONE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_from_keycloak',
      scope: 'astad.aprofiel.v1.username astad.aprofiel.v1.name astad.aprofiel.v1.avatar astad.aprofiel.v1.email astad.aprofiel.v1.phone',
      redirect_uri: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_PHONE_REDIRECT_URI || 'http://localhost:3000/callback/profiel_keycloak_phone',
      tokenurl: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_PHONE_AUTH_TOKENURL || 'https://identity-o.digipolis.be/auth/realms/antwerpen',
    },
  },
  profiel_keycloak_email: {
    title: 'Authentication 2.0 - OIDC - keycloak - email - for mobile',
    uri: {
      scheme: process.env.SERVICE_PROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_PROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/shared-identity-data/v1',
      correlation: true,
    },
    auth: {
      version: 'v3',
      oidc_issuer: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_EMAIL_ISSUER || '',
      response_type: 'code',
      // consent_required: 'false',
      minimal_assurance_level: 'low',
      auth_methods: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_EMAIL || 'a-profiel-email',
      client_id: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_EMAIL_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_EMAIL_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_from_keycloak',
      scope: 'astad.aprofiel.v1.username astad.aprofiel.v1.name astad.aprofiel.v1.avatar astad.aprofiel.v1.email astad.aprofiel.v1.phone',
      redirect_uri: process.env.SERVICE_PROFIEL_KEYCLOAK_AUTH_METHOD_EMAIL_REDIRECT_URI || 'http://localhost:3000/callback/profiel_keycloak_email',
      tokenurl: process.env.SERVICE_PROFIEL_KEYCLOAK_ACM_AUTH_TOKENURL || 'https://identity-o.digipolis.be/auth/realms/antwerpen',
    },
  },
  profiel: {
    title: 'Authentication 2.0',
    uri: {
      scheme: process.env.SERVICE_PROFIEL_URI_SCHEME || 'https',
      domain: process.env.SERVICE_PROFIEL_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/shared-identity-data/v1',
      correlation: true,
    },
    auth: {
      version: 'v2',
      response_type: 'code',
      // consent_required: 'false',
      minimal_assurance_level: 'low',
      auth_methods: process.env.SERVICE_PROFIEL_AUTH_METHODS || 'fas-citizen-bmid,fas-citizen-eid,fas-citizen-totp,fas-citizen-otp,iam-aprofiel-userpass',
      client_id: process.env.SERVICE_PROFIEL_ACM_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_PROFIEL_ACM_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'astad.aprofiel.v1.username',
      redirect_uri: process.env.SERVICE_PROFIEL_ACM_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/profiel',
    },
  },
  profiel_enterprise: {
    title: 'Authentication 2.0 - Enterprise',
    uri: {
      scheme: process.env.SERVICE_PROFIEL_ENTERPRISE_URI_SCHEME || 'https',
      domain: process.env.SERVICE_PROFIEL_ENTERPRISE_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/shared-identity-data/v1',
      correlation: true,
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
      correlation: true,
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
  entra: {
    title: 'Entra - Microsoft',
    auth: {
      url: '/login'
    },
  },
  profiel_mandate: {
    title: 'Authentication 2.0 - Mandate',
    uri: {
      scheme: process.env.SERVICE_PROFIEL_HINTED_URI_SCHEME || 'https',
      domain: process.env.SERVICE_PROFIEL_HINTED_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/acpaas/shared-identity-data/v1',
      correlation: true,
    },
    auth: {
      version: 'v2',
      response_type: 'code',
      minimal_assurance_level: 'low',
      auth_methods: process.env.SERVICE_PROFIEL_MANDATE_AUTH_METHODS || 'fas-mandate-bmid,fas-mandate-bmid-eid,fas-mandate-totp,fas-mandate-otp',
      client_id: process.env.SERVICE_PROFIEL_MANDATE_ACM_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_PROFIEL_MANDATE_ACM_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'astad.aprofiel.v1.username astad.aprofiel.v1.name astad.aprofiel.v1.avatar astad.aprofiel.v1.email astad.aprofiel.v1.phone',
      redirect_uri: process.env.SERVICE_PROFIEL_MANDATE_ACM_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/profiel',
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
  cloudid: {
    title: 'M-Profiel cloud-id',
    uri: {
      scheme: process.env.SERVICE_MPROFIEL_CLOUD_URI_SCHEME || 'https',
      domain: process.env.SERVICE_MPROFIEL_CLOUD_URI_DOMAIN || 'api-gw-o.antwerpen.be',
      path: '/astad/mprofiel/v1/v1',
    },
    auth: {
      version: 'v1',
      response_type: 'code',
      auth_type: 'cloud',
      service: process.env.SERVICE_MPROFIEL_CLOUD_AUTH_SERVICE || 'astad.mprofiel.v1',
      logout_service: 'astad.cloud.v1',
      client_id: process.env.SERVICE_MPROFIEL_CLOUD_AUTH_CLIENT_ID || 'YOUR_CLIENT_ID',
      client_secret: process.env.SERVICE_MPROFIEL_CLOUD_AUTH_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
      scope: 'all',
      redirect_uri: process.env.SERVICE_MPROFIEL_CLOUD_AUTH_REDIRECT_URI || 'http://localhost:3000/callback/cloudid',
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
