const _ = require('lodash');

const { Topic, elasticsearchClient } = require('../../models/elassandra');

/**
 *
 * @param {string} topicName
 * @param {number} [ttl]
 */
function createTopic(topicName, ttl) {
  topicName = topicName.replace(/[^\w\s-]/g, '');
  return Topic.insert(
    {
      name: topicName
    },
    {
      ifNotExists: true,
      ttl: ttl
    }
  );
}

/**
 *
 * @param {string} [prefix='']
 * @param {number} [page=1]
 */
function searchTopic(prefix = '', page = 1) {
  page = _.toInteger(page);
  page = page < 1 ? 1 : page;

  return elasticsearchClient.search({
    index: 'lms.topic',
    body: {
      query: {
        prefix: {
          name: {
            value: prefix
          }
        }
      },
      from: (page - 1) * 10,
      size: 10
    }
  });
}

module.exports = {
  createTopic: createTopic,
  searchTopic: searchTopic
};
