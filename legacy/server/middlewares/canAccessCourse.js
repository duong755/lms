/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const courseService = require('../services/Course');
/**
 * @type {RequestHandler}
 */
const canAccessCourse = async (req, res, next) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const userId = req.session.userId;
  try {
    const result = await courseService.getCourseById(teacherId, courseId);
    const course = result.body._source;
    if (result.body.found) {
      if (userId === course.teacher_id) {
        next();
      } else if (course.members.indexOf(userId) >= 0) {
        next();
      } else {
        res.status(401).json({ message: 'You not access this course' });
      }
    } else {
      res.status(400).json({ error: 'Course does not exist' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
};

module.exports = canAccessCourse;
