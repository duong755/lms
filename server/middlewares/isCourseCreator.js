/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const courseService = require('../services/Course');
/**
 * @type {RequestHandler}
 */
const isCourseCreator = async (req, res, next) => {
  const userId = req.session.userId;
  const courseId = req.params.courseId;
  try {
    const result = await courseService.getCourseById(userId, courseId);
    if (result.body.found) {
      next();
    } else {
      res.status(400).json({
        successful: false
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Unexpected error occurred'
    });
  }
};

module.exports = isCourseCreator;
