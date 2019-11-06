const cassandra = require('cassandra-driver');
const elasticsearch = require('@elastic/elasticsearch');

const cassandraClient = new cassandra.Client({
  contactPoints: ['127.0.0.1:9042'],
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

const elasticsearchClient = new elasticsearch.Client({
  node: ['http://127.0.0.1:9200']
});

elasticsearchClient.search(
  {
    index: 'lms'
  },
  (err, result) => {
    if (err) throw err;
    console.log(result);
  }
);

module.exports = {
  cassandraClient: cassandraClient,
  mapper: mapper,
  elasticsearchClient: elasticsearchClient
};
