require('dotenv').config();
const path = require('path');

const next = require('next');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const universalCookie = require('universal-cookie-express');
const cookies = require('cookies');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');

const apiRoute = require('./routes');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dev });
const handler = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(helmet());
    server.use(cookies.express());
    server.use(compression());
    server.use(logger('dev'));
    server.use(express.json());
    server.use(express.raw());
    server.use(express.text());
    server.use(express.urlencoded({ extended: false }));
    server.use(express.static(path.resolve(__dirname, '../public')));

    server.use(cookieParser());
    server.use(universalCookie());
    server.use(passport.initialize());
    server.use(passport.session());

    server.use('/api', apiRoute);

    server.get('/_next/*', handler);

    server.use((req, res) => {
      handler(req, res, '_error', req.query);
    });
    server.listen(port, (err) => {
      if (err) {
        throw err;
      }

      if (process.env.NODE_ENV === 'production') {
        console.log('> Ready');
      } else {
        console.log(`> Ready on http://localhost${port === 80 ? '' : `:${port}`}`);
      }
    });
  })
  .catch((err) => {
    console.error(err);
  });
