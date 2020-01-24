import path from 'path';
import url from 'url';

import dayjs from 'dayjs';
import next from 'next';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import session from 'express-session';
import CassandraStore from 'cassandra-store';
import { Client, ClientOptions } from 'cassandra-driver';

import apiRouter from './api';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

app
  .prepare()
  .then(() => {
    const server = express();

    const CLOUD = process.env.CLOUD;
    const CASSANDRA_CONTACT_POINTS: string[] | undefined = (process.env.CASSANDRA_CONTACT_POINTS || 'localhost').split(
      /\s*,\s*/g
    );
    const CASSANDRA_USERNAME = process.env.CASSANDRA_USERNAME || 'cassandra';
    const CASSANDRA_PASSWORD = process.env.CASSANDRA_PASSWORD || 'cassandra';

    const clientOptions: ClientOptions = {
      keyspace: 'lms',
      credentials: {
        username: CASSANDRA_USERNAME,
        password: CASSANDRA_PASSWORD
      },
      queryOptions: {
        keyspace: 'lms',
        prepare: true,
        counter: true
      }
    };
    if (CLOUD) {
      clientOptions.cloud = {
        secureConnectBundle: path.resolve(process.cwd(), 'secure-connect-lmsdb.zip')
      };
    } else {
      clientOptions.contactPoints = CASSANDRA_CONTACT_POINTS;
    }

    const store = new CassandraStore({
      table: 'session',
      client: new Client(clientOptions),
      clientOptions: clientOptions
    });

    server.use(helmet());
    server.use(compression());
    server.use(cookieParser());

    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());
    server.use(express.text());
    server.use(express.raw());
    server.use(express.static(path.resolve(__dirname, '../public')));

    server.use(
      session({
        secret: process.env.SESSION_SECRET || 'CASSANDRA_SESSION_SECRET',
        store: store,
        cookie: {
          expires: dayjs()
            .add(1, 'week')
            .toDate(),
          httpOnly: true,
          path: '/',
          secure: 'auto',
          sameSite: true
        },
        proxy: true,
        resave: false,
        name: 'lms.sid',
        saveUninitialized: true
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
