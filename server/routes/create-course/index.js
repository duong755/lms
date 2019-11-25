const { Router } = require('express');

const createCourseRouter = Router({ mergeParams: true });

/**
 * create course
 */
createCourseRouter.post('/', (req, res) => {
  res.end('/api/create-course');
});

module.exports = createCourseRouter;
