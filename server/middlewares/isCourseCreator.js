/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const courseService = require('../services/Course');
/**
 * @type {RequestHandler}
 */
const isCourseCreator = async (req, res, next) => {
  const teacher = res.locals.user;
  try {
    const result = await courseService.getCourseById(teacher.id, req.params.courseId);
    if (result.body.found) {
      next();
    } else {
      res.status(400).json({
        error: 'You do not own this course'
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

module.exports = isCourseCreator;
