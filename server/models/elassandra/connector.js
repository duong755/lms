const cassandra = require('cassandra-driver');

const cassandraClient = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  keyspace: 'lms',
  localDataCenter: 'DC1',
  isMetadataSyncEnabled: true,
  queryOptions: {
    keyspace: 'lms',
    traceQuery: true,
    logged: true,
    captureStackTrace: true,
    consistency: cassandra.types.consistencies.one
  }
});

const mapper = (tableName, modelName) =>
  new cassandra.mapping.Mapper(tableName, {
    models: {
      [modelName]: {
        keyspace: 'lms',
        tables: [tableName],
        mappings: new cassandra.mapping.UnderscoreCqlToCamelCaseMappings()
      }
    }
  });

module.exports = {
  cassandraClient: cassandraClient,
  mapper: mapper
};
