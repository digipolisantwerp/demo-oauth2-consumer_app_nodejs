const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const router = require('./app/routes');
const addRequestId = require('./app/middleware/id.middleware');
const errorMiddleware = require('./app/middleware/error.middleware');

let app;

function startApp() {
  app = express();

  app.use(addRequestId);
  app.set('view engine', 'ejs');
  app.set('views', path.join('./app/', 'views'));
  app.enable('trust proxy');
  app.use(helmet({
    // Add to load styleguide && post redirect to consent
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        'script-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'cdn.antwerpen.be'],
        'form-action': ["'self'", 'localhost:3000', '*.antwerpen.be'],
      },
    },
  }));

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(router);
  app.use(errorMiddleware);
  return app;
}

module.exports = startApp;
