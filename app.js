const express = require('express');
const path = require('path');
const logger = require('morgan');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const errorHandler = require('errorhandler');
const chalk = require('chalk');
const config = require('./config/app.conf.js');
const router = require('./app/routes/main');

const app = express();

process.env.NODE_ENV = config.environment.toLowerCase();

app.set('port', config.port);
app.set('views', path.join('./app/', 'views'));
app.set('view engine', 'ejs');

app.use(helmet());

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
  app.use(compression());
}

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(methodOverride());

app.use(router);
app.use('/', express.static('./public'));

if (app.get('env') === 'development') {
  app.use(logger('dev'));
  app.use(errorHandler());
}

app.listen(app.get('port'), () => {
  console.log(`${chalk.white.bgRed.bold(' A ')} ${chalk.grey.bgBlack(`Express server listening on port ${app.get('port')}`)}`);
});

module.exports = app;
