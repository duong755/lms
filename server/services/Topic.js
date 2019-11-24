const _ = require('lodash');

const { Topic, elasticsearchClient, mapper } = require('../models');

/**
 *
 * @param {string | string[]} topicNames
 * @param {number} [ttl]
 */
function createTopic(topicNames, ttl) {
  if (!(topicNames instanceof Array)) {
    topicNames = [topicNames];
  }
  const newTopics = topicNames.map((currentTopicName) =>
    Topic.batching.insert({ name: currentTopicName }, { ttl: ttl })
  );
  return mapper.batch(newTopics);
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
    type: 'topic',
    from: (page - 1) * 10,
    size: 10,
    body: {
      query: {
        prefix: {
          name: {
            value: prefix
          }
        }
      }
    }
  });
}

module.exports = {
  createTopic: createTopic,
  searchTopic: searchTopic
};
