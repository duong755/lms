const { Router } = require('express');

const auth = require('../../../../../middlewares/auth');

const commentRouter = Router({ mergeParams: true });

/**
 * comment pagination
 */
commentRouter.get('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson/:lessonId/comment');
});

/**
 * create comment
 */
commentRouter.post('/', auth, (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson/:lessonId/comment');
});

/**
 * edit comment
 */
commentRouter.put('/:commentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson/:lessonId/comment/:commentId');
});

/**
 * delete comment
 */
commentRouter.delete('/:commentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson/:lessonId/comment/:commentId');
});

module.exports = commentRouter;
