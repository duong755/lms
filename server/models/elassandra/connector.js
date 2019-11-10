const cassandra = require('cassandra-driver');
const elasticsearch = require('@elastic/elasticsearch');

const CASSANDRA_CONTACT_POINTS = process.env.CASSANDRA_CONTACT_POINTS.split(/,\s+/g);
const KEYSPACE = process.env.KEYSPACE;
const LOCAL_DATA_CENTER = process.env.LOCAL_DATA_CENTER;

const cassandraClient = new cassandra.Client({
  contactPoints: CASSANDRA_CONTACT_POINTS,
  keyspace: KEYSPACE,
  localDataCenter: LOCAL_DATA_CENTER,
  isMetadataSyncEnabled: true,
  encoding: {
    map: Map,
    set: Set
  },
  queryOptions: {
    keyspace: KEYSPACE,
    traceQuery: true,
    logged: true,
    captureStackTrace: true,
    consistency: cassandra.types.consistencies.one
  }
});

/**
 *
 * @param {string[] | import('cassandra-driver').mapping.ModelTables[]} tableNames
 * @param {string} modelName
 */
const mapper = (tableNames, modelName) =>
  new cassandra.mapping.Mapper(cassandraClient, {
    models: {
      [modelName]: {
        keyspace: KEYSPACE,
        tables: tableNames,
        mappings: new cassandra.mapping.UnderscoreCqlToCamelCaseMappings()
      }
    }
  });

const elasticsearchClient = new elasticsearch.Client({
  node: process.env.ELASTICSEARCH_URL.split(/,\s+/g)
});

module.exports = {
  cassandraClient: cassandraClient,
  cassandraTypes: cassandra.types,
  mapper: mapper,
  elasticsearchClient: elasticsearchClient
};
