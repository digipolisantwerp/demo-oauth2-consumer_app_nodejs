const digipolisLogger = require('@digipolis/log');
const { log } = require('../../config/app.conf');

const logger = digipolisLogger(console, log.format);

module.exports = logger;
