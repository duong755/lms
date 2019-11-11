import dotenv from 'dotenv';

import { cassandraClient, elasticsearchClient } from '../server/models/elassandra/connector';

dotenv.config();

describe('Elassandra Connect', () => {
  it('Environment Variables', () => {
    const CASSANDRA_CONTACT_POINTS = process.env.CASSANDRA_CONTACT_POINTS;
    const LOCAL_DATA_CENTER = process.env.LOCAL_DATA_CENTER;
    const KEYSPACE = process.env.KEYSPACE;
    const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL;

    expect(typeof CASSANDRA_CONTACT_POINTS).toBe('string');
    expect(typeof LOCAL_DATA_CENTER).toBe('string');
    expect(typeof KEYSPACE).toBe('string');

    expect(typeof ELASTICSEARCH_URL).toBe('string');
  });

  it('Cassandra Connect', async () => {
    const connect = await cassandraClient.connect();
    expect(connect).toBeUndefined();
  });

  it('Elasticsearhc Connect', async () => {
    const connect = await elasticsearchClient.cat.health();
    expect(connect.statusCode).toBe(200);
  });
});
