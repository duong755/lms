/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const { Router } = require('express');
const Joi = require('@hapi/joi');

const { TopicServices, CourseServices } = require('../../services');
const isAuthenticated = require('../../middlewares/isAuthenticated');
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
 * create topic
 */
topicRouter.post('/', isAuthenticated, validateTopicName, async (req, res) => {
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
 * search topics
 */
topicRouter.all('/', async (req, res) => {
  let topicList = [];
  const topicName = String(req.query.query).trim();
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

/**
 * search courses by topic
 */
topicRouter.get('/:topicName', async (req, res) => {
  const topicName = req.params.topicName;
  const page = Number(req.query.page) || 1;
  try {
    const courseRes = await CourseServices.searchCourses('', [topicName], void 0, void 0, page);
    const courses = courseRes.body.hits.hits.map((current) => current._source);
    res.status(200).json({
      courses: courses,
      total: courseRes.body.hits.total
    });
  } catch (searchCourseErr) {
    res.status(500).json({
      error: 'An unexpected error occured'
    });
  }
});

module.exports = topicRouter;
