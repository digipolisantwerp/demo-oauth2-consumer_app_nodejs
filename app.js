const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
const config = require('./config/app.conf');
const router = require('./app/routes/main');

const app = express();

process.env.NODE_ENV = config.environment.toLowerCase();

app.set('port', config.port);
app.set('views', path.join('./app/', 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  req.id = uuidv4();
  return next();
});
app.use(helmet({
  // add to load styleguide
  crossOriginEmbedderPolicy: false,
}));

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
  app.use(compression());
}

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(router);
app.use('/', express.static('./public'));
app.use((err, req, res, next) => {
  try {
    console.log(req.id, err);
    return res.status(500).render('error', {
      ref: req.id,
      title: err.message,
    });
  } catch (e) {
    return next(e);
  }
});

app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});

module.exports = app;
