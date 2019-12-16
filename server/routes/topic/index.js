/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const { Router } = require('express');
const Joi = require('@hapi/joi');

const { TopicServices } = require('../../services');

const topicRouter = Router({ mergeParams: true });

const topicNameSchema = Joi.string()
  .trim()
  .regex(/^[A-Za-z0-9\-_\s]+$/, { name: 'topicNameRegex' })
  .required();

/**
 * @type {RequestHandler}
 */
const validateTopicName = (req, res, next) => {
  const validationResults = topicNameSchema.validate(req.body.topicName);
  if (validationResults.error) {
    res.status(400).json({ error: 'Topic name is invalid' });
    return;
  } else {
    req.body.topicName = validationResults.value;
    next();
  }
};

/**
 * search topic
 */
topicRouter.get('/', (req, res) => {
  res.end('/api/topic?q=*');
});

/**
 * create topic
 */
topicRouter.post('/', validateTopicName, async (req, res) => {
  try {
    const createTopicRes = await TopicServices.createTopic(req.body.topicName);
    if (createTopicRes.wasApplied()) {
      res.status(201).json({
        successful: true
      });
    } else {
      res.status(204).json({
        warning: 'Topic name has already been created'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Unexpected error occurred'
    });
  }
});

/**
 * get courses by topic
 */
topicRouter.all('/:topicName', async (req, res) => {
  let topicList = [];
  const topicName = String(req.params.topicName).trim();
  try {
    const topicRes = await TopicServices.searchTopic(topicName, 1);
    if (topicRes.body.hits.total) {
      topicList = topicRes.body.hits.hits.map((currentTopic) => currentTopic._source.name);
      res.status(200).json({
        topics: topicList
      });
    } else {
      res.status(200).json({
        topics: topicList
      });
    }
  } catch (err) {
    console.error(err);
    res.status(200).json({
      topics: topicList
    });
  }
});

module.exports = topicRouter;
