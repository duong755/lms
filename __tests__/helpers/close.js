import { elasticsearchClient, cassandraClient } from '../../server/models/elassandra';

/**
 *
 * @param {jest.DoneCallback} done
 */
export async function closeConnection(done) {
  await elasticsearchClient.close();
  await cassandraClient.shutdown();
  done();
}
