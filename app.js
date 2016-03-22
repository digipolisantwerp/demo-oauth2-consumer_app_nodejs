'use strict';

// Dependencies
var express = require('express');
var path = require('path');
var logger = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var errorHandler = require('errorhandler');
var chalk = require('chalk');
var glob = require('glob');
var yamlConfig = require('node-yaml-config');

// Base dir
global.__base = __dirname ;

// Create Express app
var app = express();

// Config
var config = yamlConfig.load(global.__base + '/config/app.yml',process.env.NODE_ENV);
process.env.NODE_ENV = config.environment.toLowerCase();


// All environments Express middleware
app.set('port', config.port);
app.set('views', path.join(__dirname + '/app/', 'views'));
app.set('view engine', 'ejs');

app.use(helmet());

// use compression to save bandwidth
var compression = require('compression');
if (process.env.NODE_ENV && process.env.NODE_ENV!== 'test') {
  app.use(compression());
}

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());


// Include routes if exists
glob('./app/routes/*.js', {}, function handleRouteFiles(err, files) {
  if (err) {
    return;
  }

  files.forEach(function requireRouteFile(file) {
    require(file)(app);
  });

});

// Public folder
app.use('/', express.static(__dirname + '/public'));

// Error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
  app.use(logger('dev'));
  app.use(errorHandler());
}


// Listen
app.listen(app.get('port'), function serverListening() {
  console.log(chalk.white.bgRed.bold(' A ') +
  ' ' + chalk.grey.bgBlack(' Express server listening on port ' + app.get('port') + ' '));
});
