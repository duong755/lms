const { Router } = require('express');

const lessonRouter = require('./lesson');
const memberRouter = require('./member');
const exerciseRouter = require('./exercise');
const examRouter = require('./exam');
const joinRequestRouter = require('./join_request');
const reviewRouter = require('./review');

const courseRouter = Router({ mergeParams: true });

/**
 * course pagination
 */
courseRouter.get('/', (req, res) => {
  /**
   * if (student) {
   *
   * } else { // teacher
   *
   * }
   */
  res.end('/api/user/:userId/course');
});

/**
 * create course
 */
courseRouter.post('/', (req, res) => {
  res.end('/api/user/:userId/course');
});

/**
 * get course data
 */
courseRouter.get('/:courseId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId');
});

/**
 * update course
 */
courseRouter.put('/:courseId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId');
});

/**
 * archive course
 */
courseRouter.delete('/:courseId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId');
});

courseRouter.use('/:courseId/lesson', lessonRouter);
courseRouter.use('/:courseId/member', memberRouter);
courseRouter.use('/:courseId/exercise', exerciseRouter);
courseRouter.use('/:courseId/exam', examRouter);
courseRouter.use('/:courseId/join_request', joinRequestRouter);
courseRouter.use('/:courseId/review', reviewRouter);

module.exports = courseRouter;
