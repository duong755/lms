import dotenv from 'dotenv';

import { cassandraClient } from '../server/models/elassandra/connector';

dotenv.config();

it('Environment Variables', () => {
  const CASSANDRA_CONTACT_POINTS = process.env.CASSANDRA_CONTACT_POINTS;
  const LOCAL_DATA_CENTER = process.env.LOCAL_DATA_CENTER;
  const KEYSPACE = process.env.KEYSPACE;

  expect(typeof CASSANDRA_CONTACT_POINTS).toBe('string');
  expect(typeof LOCAL_DATA_CENTER).toBe('string');
  expect(typeof KEYSPACE).toBe('string');
});

it('Cassandra Connect', async () => {
  const connect = await cassandraClient.connect();
  expect(connect).toBeUndefined();
});

afterAll(async (done) => {
  await cassandraClient.shutdown();
  done();
});
