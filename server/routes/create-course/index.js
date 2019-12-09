const { Router } = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');

const courserService = require('../../services/Course');
const { cassandraTypes } = require('../../models/connector');
const createCourseRouter = Router({ mergeParams: true });

/**
 * create course
 */
createCourseRouter.post('/', async (req, res) => {
  const user = res.locals.user;
  if (user.type === 'teacher') {
    const newCourse = {
      courseId: cassandraTypes.Uuid.random(),
      teacherId: user.id,
      description: req.body.description,
      topics: req.body.topics || [],
      archive: false,
      courseName: req.body.courseName,
      members: req.body.members || []
    };

    const schema = Joi.object({
      description: Joi.string()
        .trim()
        .required(),
      topics: Joi.array()
        .items(Joi.string().trim())
        .unique(),
      archive: Joi.bool(),
      courseName: Joi.string()
        .trim()
        .required(),
      members: Joi.array().unique()
    });

    const validationResult = schema.validate(newCourse, { allowUnknown: true });

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
        res.status(200).json({
          Success: 'Create course successfully'
        });
      } else {
        res.status(400).json({
          Error: 'Can not create this course, please try again'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Unexpected error occured'
      });
    }
  }
});

module.exports = createCourseRouter;
