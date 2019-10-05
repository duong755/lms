require('dotenv').config();
const path = require('path');
const next = require('next');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const reqHandler = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(logger('dev'));
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(cookieParser());
    server.use(express.static(path.join(process.env.PWD, 'static')));

    server.get('/', (req, res) => {
      reqHandler(req, res, '/', req.query);
    });

    server.get('/api/member', (req, res) => {
      reqHandler(req, res, '/api/member', req.query);
    });

    server.get('/api/member/:id', (req, res) => {
      reqHandler(req, res, '/api/member/:id', req.query);
    });

    server.use((req, res) => {
      reqHandler(req, res, '_error', req.query);
    });
    server.listen(process.env.PORT, err => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on http://localhost${process.env.PORT === 80 ? '' : `:${process.env.PORT}`}`);
    });
  })
  .catch(err => {
    console.error(err);
  });
