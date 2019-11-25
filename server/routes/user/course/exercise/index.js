const { Router } = require('express');

const exerciseRouter = Router({ mergeParams: true });

/**
 * exercise pagination
 */
exerciseRouter.get('/', (req, res) => {
  // const page = Number(req.query.page);
  // console.log(page);
  res.end('/api/user/:userId/course/:courseId/exercise');
});

/**
 * create exercise
 */
exerciseRouter.post('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exercise');
});

/**
 * get exercise by id
 */
exerciseRouter.get('/:exerciseId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId');
});

/**
 * submit exercisework
 */
exerciseRouter.post('/:exerciseId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId');
});

/**
 * edit exercise by id
 */
exerciseRouter.put('/:exerciseId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId');
});

/**
 * delete exercise by id
 */
exerciseRouter.delete('/:exerciseId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId');
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
exerciseRouter.get('/:exerciseId/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId/:studentId');
});

module.exports = exerciseRouter;
