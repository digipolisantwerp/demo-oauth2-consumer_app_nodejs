const { setBooleanValue } = require('./config.helper');

module.exports = {
  environment: process.env.ENVIRONMENT || 'development',
  port: process.env.PORT || 3000,
  log: {
    type: 'log',
  },
  apm: {
    enabled: setBooleanValue(process.env.APM_ENABLED, false),
    serviceName: process.env.APM_SERVICENAME,
    environment: process.env.APM_ENVIRONMENT,
    secretToken: process.env.APM_SECRETTOKEN,
    serverUrl: process.env.APM_SERVERURL,
    transactionSampleRate: parseFloat(process.env.APM_SAMPLE_RATE || 0.2),
  },
};
