/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const courseService = require('../services/Course');
/**
 * @type {RequestHandler}
 */
const isCourseCreator = async (req, res, next) => {
  const userId = req.session.userId;
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  try {
    const result = await courseService.getCourseById(teacherId, courseId);
    if (result.body.found) {
      if (result.body._source.teacher_id === userId) {
        next();
      } else {
        res.status(403).json({
          error: 'Not course creator'
        });
      }
    } else {
      res.status(404).json({
        error: 'Course not found'
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
