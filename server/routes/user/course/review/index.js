const { Router } = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');

const reviewService = require('../../../../services/Review');
const reviewRouter = Router({ mergeParams: true });

/**
 * review pagination
 */
reviewRouter.get('/', async (req, res) => {
  const page = req.query.page || 1;
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  try {
    const resultGet = await reviewService.getReviews(teacherId, courseId, page);
    const reviews = resultGet.body.hits.hits.map((current) => current._source);
    const total = resultGet.body.hits.total;
    res.status(200).json({ reviews: reviews, total: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/review');
});

/**
 * create review
 */
reviewRouter.post('/', async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const studentId = res.locals.user.id;
  const content = req.body.content;
  const star = req.body.star;

  const schema = Joi.object({
    content: Joi.string()
      .trim()
      .required(),
    star: Joi.number()
      .min(1)
      .max(5)
      .integer()
      .required()
  });

  try {
    const newReview = {
      teacherId: teacherId,
      courseId: courseId,
      studentId: studentId,
      content: content,
      star: star
    };

    const validationResult = schema.validate(newReview, { allowUnknown: true });

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

    const result = await reviewService.upsertReview(newReview, void 0, true);
    if (result.wasApplied()) {
      res.status(200).json({ successful: 'Create new revirew successfully' });
    } else {
      res.status(400).json({ error: 'Can not create new review' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/review');
});

/**
 * edit review
 */
reviewRouter.put('/:studentId', async (req, res) => {
  const content = req.body.content;
  const star = req.body.start;
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;

  const schema = Joi.object({
    content: Joi.string()
      .trim()
      .required(),
    star: Joi.number()
      .min(1)
      .max(5)
      .integer()
      .required()
  });

  const newReview = {
    teacherId: teacherId,
    courseId: courseId,
    studentId: studentId,
    content: content,
    star: star
  };

  const validationResult = schema.validate(newReview, { allowUnknown: true });

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
    const result = await reviewService.upsertReview(
      newReview,
      ['teacher_id', 'course_id', 'student_id', 'content', 'star'],
      false
    );
    if (result.wasApplied()) {
      res.status(200).json({ successful: 'Update review successfully' });
    } else {
      res.status(400).json({ error: 'Can not update this review' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/review/:studentId');
});

reviewRouter.delete('/:studentId', async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;
  try {
    const result = await reviewService.deleteReview(teacherId, courseId, studentId);
    if (result.wasApplied()) {
      res.status(200).json({ successful: 'Delete review successfully' });
    } else {
      res.status(400).json({ error: 'Can not delete this review' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/review/:studentId');
});

module.exports = reviewRouter;
