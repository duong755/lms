import path from 'path';
import url from 'url';

import next from 'next';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import apiRouter from './api';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(helmet());
    server.use(compression());
    server.use(cookieParser());

    server.use(express.json());
    server.use(express.text());
    server.use(express.raw());
    server.use(
      express.static(path.resolve(__dirname, '../public'), {
        extensions: ['.css', '.js', '.ico', '.png', '.jpeg', '.jpg']
      })
    );

    server.use('/api', apiRouter);

    server.use((req, res) => {
      const parsedUrl = url.parse(req.url || '', true);
      const { pathname, query } = parsedUrl;

      app.render(req, res, pathname || '/', query);
    });

    server.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch(console.error);
