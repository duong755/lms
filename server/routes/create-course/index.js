/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

const { Router } = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');

const courserService = require('../../services/Course');
const topicService = require('../../services/Topic');
const { cassandraTypes } = require('../../models');
const createCourseRouter = Router({ mergeParams: true });

/**
 * @type {RequestHandler}
 */
const isTeacher = (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = res.locals.user;
    if (user.type === 'teacher') {
      next();
    } else {
      res.status(403).json({
        error: 'Only teacher can create new course'
      });
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
      .allow(),
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
