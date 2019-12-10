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
  console.log(user);
  try {
    const result = await courseService.getCourseById(teacherId, req.params.courseId);
    const course = result.body._source;
    if (result.body.found) {
      if (user.id === course.teacher_id && !course.members) {
        next();
      } else if (course.members && course.members.indexOf(user.id)) {
        next();
      }
    } else {
      res.status(400).json({ error: 'Can not access this course' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
};

module.exports = canAccessCourse;
