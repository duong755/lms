import { elasticsearchClient } from '../server/models';

import { closeConnection } from './helpers/close';
import tables from './helpers/tables';

describe('Test Elasticsearch Indices', () => {
  tables.forEach((currentTableName) => {
    const currentIndexName = `lms.${currentTableName}`;
    it(currentIndexName, async () => {
      const res = await elasticsearchClient.indices.getMapping({
        index: currentIndexName,
        type: currentTableName
      });
      expect(res.body[currentIndexName].mappings[currentTableName].properties).toBeTruthy();
    });
  });
});

afterAll(closeConnection);
