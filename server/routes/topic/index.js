const { Router } = require('express');

const topicRouter = Router({ mergeParams: true });

/**
 * search topic
 */
topicRouter.get('/', (req, res) => {
  res.end('/api/topic?q=*');
});

/**
 * create topic
 */
topicRouter.post('/', (req, res) => {
  res.end('/api/topic');
});

/**
 * get courses by topic
 */
topicRouter.all('/:topicName', (req, res) => {
  res.end('/api/topic/:topicName');
});

module.exports = topicRouter;
