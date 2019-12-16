const cassandra = require('cassandra-driver');
const _ = require('lodash');

const { cassandraClient } = require('./connector');

const KEYSPACE = process.env.KEYSPACE || 'lms';

const mappings = new cassandra.mapping.UnderscoreCqlToCamelCaseMappings();
const tableNames = [
  'course',
  'topic',
  'user',
  'member',
  'review',
  'join_request',
  'lesson',
  'comment',
  'exercise',
  'exercise_work',
  'exam',
  'exam_work'
];
const mappingModelOptions = _.reduce(
  tableNames,
  (options, currentTable) => {
    options[currentTable] = {
      keyspace: KEYSPACE,
      tables: [currentTable],
      mappings: mappings
    };
    return options;
  },
  {}
);

const ultimateMapper = new cassandra.mapping.Mapper(cassandraClient, {
  models: mappingModelOptions
});

module.exports = ultimateMapper;
