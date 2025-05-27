const http = require('http');
const apm = require('elastic-apm-node');
const config = require('./config/app.conf');
const startapp = require('./app');
const logger = require('./app/helpers/logging.helper');

if (config.apm.enabled) apm.start(config.apm);

const app = startapp();

const server = http.createServer(app);
server.keepAliveTimeout = 61000;
server.headersTimeout = 62000;

server.listen(config.port);
logger.info(`Listening on port ${config.port}`);

module.exports = app;
