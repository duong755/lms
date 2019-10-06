const path = require('path');
const next = require('next');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dev });
const handler = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(logger('dev'));
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(cookieParser());
    server.use(express.static(path.join(process.env.PWD, 'static')));

    server.use((req, res) => {
      handler(req, res, '_error', req.query);
    });
    server.listen(port, err => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on http://localhost${port === 80 ? '' : `:${port}`}`);
    });
  })
  .catch(err => {
    console.error(err);
  });
