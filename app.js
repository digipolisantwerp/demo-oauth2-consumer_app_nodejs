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

  app.use(helmet({
    // Add to load styleguide && post redirect to consent
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        'form-action': ["'self'", 'localhost:4000', '*.antwerpen.be'],
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
