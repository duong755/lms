const { Router } = require('express');

const joinRequestRouter = Router({ mergeParams: true });

/**
 * join_request pagination
 */
joinRequestRouter.get('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/join_request');
});

/**
 * create join request
 */
joinRequestRouter.post('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/join_request');
});

/**
 * accept join request
 */
joinRequestRouter.post('/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/join_request/:studentId');
});

/**
 * decline join request
 */
joinRequestRouter.delete('/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/join_request/:studentId');
});

module.exports = joinRequestRouter;
