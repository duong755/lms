const { Router } = require('express');

const commentRouter = require('./comment');

const lessonRouter = Router({ mergeParams: true });

/**
 * lesson pagination
 */
lessonRouter.get('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson');
});

/**
 * create lesson
 */
lessonRouter.post('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson');
});

/**
 * get lesson data
 */
lessonRouter.get('/:lessonId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson/:lessonId');
});

/**
 * edit lesson
 */
lessonRouter.put('/:lessonId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson/:lessonId');
});

/**
 * delete lesson
 */
lessonRouter.delete('/:lessonId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson/:lessonId');
});

lessonRouter.use('/:lessonId/comment', commentRouter);

module.exports = lessonRouter;
