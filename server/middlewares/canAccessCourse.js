/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const courseService = require('../services/Course');
/**
 * @type {RequestHandler}
 */
const canAccessCourse = async (req, res, next) => {
  const teacherId = req.params.userId;
  const user = res.locals.user;
  try {
    const result = await courseService.getCourseById(teacherId, req.params.courseId);
    const course = result.body._source;
    if (result.body.found && (course.members.indexOf(user.id) >= 0 || user.id === course.teacher_id)) {
      next();
    } else {
      res.status(400).json({ error: 'Can not access this course' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = canAccessCourse;
