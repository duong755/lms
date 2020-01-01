require('dotenv').config();
const path = require('path');

const next = require('next');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const universalCookie = require('universal-cookie-express');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');

const dayjs = require('dayjs');

const apiRoute = require('./routes');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dev });
const handler = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use((req, res, next) => {
      if (process.env.HEROKU) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
          res.redirect(`https://${req.headers['host']}${req.url}`);
        } else {
          next();
        }
      } else {
        next();
      }
    });
    server.use(helmet());
    server.use(compression());
    server.use(
      logger('dev', {
        skip: (req) => {
          return /(^\/_next|\/css|\/fonts|\/favicon\.ico)/.test(req.path);
        }
      })
    );
    server.use(express.json());
    server.use(express.raw());
    server.use(express.text());
    server.use(express.urlencoded({ extended: true }));
    server.use(express.static(path.resolve(__dirname, '../public')));

    server.use(cookieParser());
    server.use(universalCookie());
    server.use(
      session({
        secret: process.env.SESSION_SECRET,
        name: 'lms.sid',
        saveUninitialized: false,
        resave: false,
        cookie: {
          httpOnly: true,
          path: '/',
          sameSite: true,
          expires: dayjs()
            .add(7, 'day')
            .toDate()
        }
      })
    );

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
