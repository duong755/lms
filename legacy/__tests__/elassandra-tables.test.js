import { cassandraClient } from '../server/models';

import { closeConnection } from './helpers/close';
import tables from './helpers/tables';

describe('Test Cassandra Tables', () => {
  tables.forEach((currentTableName) => {
    const query = `SELECT * FROM ${currentTableName}`;
    it(query, async () => {
      const result = await cassandraClient.execute(query);
      expect(result.rows).toBeInstanceOf(Array);
    });
  });
});

afterAll(closeConnection);
