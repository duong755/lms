const { Router } = require('express');

const memberRouter = Router({ mergeParams: true });

/**
 * member pagination
 */
memberRouter.get('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/member');
});

/**
 * leave course
 */
memberRouter.delete('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/member');
});

/**
 * remove member
 */
memberRouter.delete('/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/member/:studentId');
});

module.exports = memberRouter;
