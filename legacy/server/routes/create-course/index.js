/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

const { Router } = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');

const courserService = require('../../services/Course');
const topicService = require('../../services/Topic');
const { cassandraTypes } = require('../../models');
const userService = require('../../services/User');
const createCourseRouter = Router({ mergeParams: true });

/**
 * @type {RequestHandler}
 */
const isTeacher = async (req, res, next) => {
  const userId = req.session.userId;
  if (userId) {
    try {
      const response = await userService.getUserById(userId);
      if (response.body.found) {
        const user = response.body._source;
        if (user.type === 'teacher') {
          next();
        } else {
          res.status(403).json({
            error: 'Only teacher can create new course'
          });
        }
      } else {
        res.status(404).json({ error: 'User does not exist' });
      }
    } catch (error) {
      res.status(500).json('Unexpected error occurred');
    }
  } else {
    res.status(401).json({
      error: 'Unauthorized'
    });
  }
};

/**
 * @type {RequestHandler}
 */
const createTopics = async (req, res, next) => {
  try {
    await topicService.createTopic(req.body.topics);
  } catch (err) {
    console.error(err);
  } finally {
    next();
  }
};

/**
 * create course
 */
createCourseRouter.post('/', isTeacher, createTopics, async (req, res) => {
  const user = res.locals.user;
  const newCourse = {
    courseId: cassandraTypes.Uuid.random(),
    teacherId: user.id,
    description: req.body.description,
    topics: req.body.topics || [],
    archive: false,
    courseName: req.body.courseName,
    members: req.body.members || []
  };
  const courseSchema = Joi.object({
    description: Joi.string()
      .trim()
      .allow(''),
    topics: Joi.array()
      .items(Joi.string().trim())
      .unique(),
    archive: Joi.bool(),
    courseName: Joi.string()
      .trim()
      .required(),
    members: Joi.array().unique()
  });

  const validationResult = courseSchema.validate(newCourse, { allowUnknown: true });

  if (validationResult.error && validationResult.error.details.length) {
    const error = _.reduce(
      validationResult.error.details,
      (result, value) => {
        const key = value.path[0];
        const message = value.message;
        result[key] = message;
        return result;
      },
      {}
    );
    res.status(400).json({ error: error });
    return;
  }
  try {
    const resultUpsert = await courserService.upsertCourse(newCourse, void 0, true);
    if (resultUpsert.wasApplied()) {
      res.status(201).json({
        successful: true,
        courseId: String(newCourse.courseId)
      });
    } else {
      res.status(400).json({
        error: 'Can not create this course, please try again'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Unexpected error occurred'
    });
  }
});

module.exports = createCourseRouter;
