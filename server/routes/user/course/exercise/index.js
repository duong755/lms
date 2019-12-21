const { Router } = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');

const exerciseService = require('../../../../services/Exercise');
const exerciseWorkService = require('../../../../services/ExerciseWork');
const { cassandraTypes } = require('../../../../models/connector');
const isCourseCreator = require('../../../../middlewares/isCourseCreator');
const canAccessCourse = require('../../../../middlewares/canAccessCourse');
const isCourseMember = require('../../../../middlewares/isCourseMember');
const canAccessExerciseWork = require('../../../../middlewares/canAccessExerciseWork');

const exerciseRouter = Router({ mergeParams: true });

/**
 * exercise pagination
 */
exerciseRouter.get('/', canAccessCourse, async (req, res) => {
  const page = req.query.page || 1;
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  try {
    const result = await exerciseService.getExercisesByCourse(teacherId, courseId, page);
    const exercises = result.body.hits.hits.map((current) => current._source);
    res.status(200).json({ exercises: exercises, total: result.body.hits.total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/exercise');
});

/**
 * create exercise
 */
exerciseRouter.post('/', isCourseCreator, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const title = req.body.title;
  const content = req.body.content;
  const deadline = req.body.deadline;
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .required(),
    content: Joi.string()
      .trim()
      .required(),
    deadline: Joi.date()
      .timestamp()
      .greater('now')
      .required()
  });

  const newExercise = {
    exerciseId: cassandraTypes.TimeUuid.now(),
    courseId: courseId,
    teacherId: teacherId,
    content: content,
    title: title,
    deadline: new Date(deadline).getTime()
  };

  const validationResult = schema.validate(newExercise, {
    errors: {
      render: true,
      wrapArrays: true
    },
    abortEarly: true,
    allowUnknown: true
  });

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
    res.status(400).json({
      error: error
    });
    return;
  }

  try {
    const result = await exerciseService.upsertExercise(newExercise, void 0, true);
    if (result.wasApplied()) {
      res.status(200).json({ successful: true, exerciseId: newExercise.exerciseId });
    } else {
      res.status(400).json({ error: 'Can not create new exercise' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/exercise');
});

/**
 * get exercise by id
 */
exerciseRouter.get('/:exerciseId', canAccessCourse, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const exerciseId = req.params.exerciseId;
  try {
    const result = await exerciseService.getExerciseById(teacherId, courseId, exerciseId);
    if (result.body.found) {
      res.status(200).json({ successful: true, exercise: result.body._source });
    } else {
      res.status(400).json({ error: 'Can not get exercise' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId');
});

/**
 * submit exercisework
 */
exerciseRouter.post('/:exerciseId', isCourseMember, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const exerciseId = req.params.exerciseId;
  const content = req.body.content;
  const studentId = res.locals.user.id;

  const schema = Joi.object({
    content: Joi.string()
      .trim()
      .required()
  });

  const newExerciseWork = {
    content: content,
    teacherId: teacherId,
    courseId: courseId,
    exerciseId: exerciseId,
    studentId: studentId,
    point: null,
    submitAt: Date.now()
  };

  const validationResult = schema.validate(newExerciseWork, {
    errors: {
      render: true,
      wrapArrays: true
    },
    abortEarly: true,
    allowUnknown: true
  });

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

    res.status(400).json({
      error: error
    });
    return;
  }

  try {
    const result = await exerciseWorkService.upsertExerciseWork(newExerciseWork, void 0, true);
    if (result.wasApplied()) {
      res.status(200).json({ successful: 'Submit exercise work successfully' });
    } else {
      res.status(400).json({ error: 'Can not submit exercise work' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId');
});

/**
 * edit exercise by id
 */
exerciseRouter.put('/:exerciseId', isCourseCreator, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const exerciseId = req.params.exerciseId;
  const title = req.body.title;
  const content = req.body.content;
  const deadline = req.body.deadline;

  try {
    let oldExercise = await exerciseService.getExerciseById(teacherId, courseId, exerciseId);

    if (oldExercise.body.found) {
      oldExercise = oldExercise.body._source;

      const newExercise = {
        exerciseId: exerciseId,
        courseId: courseId,
        teacherId: teacherId,
        content: content !== undefined ? content : oldExercise.content,
        title: title !== undefined ? title : oldExercise.title,
        deadline: deadline !== undefined ? new Date(deadline).getTime() : oldExercise.deadline
      };

      const result = await exerciseService.upsertExercise(
        newExercise,
        ['teacher_id', 'course_id', 'id', 'content', 'title', 'deadline'],
        false
      );

      if (result.wasApplied()) {
        res.status(200).json({ successful: 'update exercise successfully' });
      } else {
        res.status(400).json({ error: 'Can not update new exercise' });
      }
    } else {
      res.status(400).json({ error: 'Can not find this course' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId');
});

/**
 * delete exercise by id
 */
exerciseRouter.delete('/:exerciseId', isCourseCreator, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const exerciseId = req.params.exerciseId;
  try {
    const result = await exerciseService.removeExercise(teacherId, courseId, exerciseId);
    if (result.wasApplied()) {
      res.status(200).json({ successful: 'Remove exercise successfully' });
    } else {
      res.status(400).json({ error: 'Can not remove this exercise' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Unexpected error occurred'
    });
  }
  // res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId');
});

/**
 * exercise summary
 */
exerciseRouter.all('/:exerciseId/summary', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId/summary');
});

/**
 * get exercise work by student
 */
exerciseRouter.get('/:exerciseId/:studentId', canAccessExerciseWork, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const exerciseId = req.params.exerciseId;
  const studentId = req.params.studentId;
  try {
    const result = await exerciseWorkService.getExerciseWorkById(teacherId, courseId, exerciseId, studentId);
    if (result.body.found) {
      res.status(200).json({
        exercise: result.body._source
      });
    } else {
      res.status(400).json({ error: 'Can not find this exercise' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Unexpected error occurred'
    });
  }
  // res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId/:studentId');
});

module.exports = exerciseRouter;
