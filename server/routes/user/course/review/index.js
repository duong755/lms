const { Router } = require('express');

const reviewRouter = Router({ mergeParams: true });

/**
 * review pagination
 */
reviewRouter.get('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/review');
});

/**
 * create review
 */
reviewRouter.post('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/review');
});

/**
 * edit review
 */
reviewRouter.put('/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/review/:studentId');
});

reviewRouter.delete('/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/review/:studentId');
});

module.exports = reviewRouter;
