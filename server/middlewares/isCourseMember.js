/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const courseService = require('../services/Course');
/**
 * @type {RequestHandler}
 */
const isCourseMember = async (req, res, next) => {
  const userId = req.session.userId;
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  try {
    const data = await courseService.getCourseById(teacherId, courseId);
    if (data.body.found) {
      const members = data.body._source.members;
      if (members.indexOf(userId) >= 0) {
        next();
      } else {
        res.status(403).json({ error: 'you are not members of this course' });
      }
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  } catch (error) {
    console.error(error);
    res.send(500).json({ error: 'Unexpected error occurred' });
  }
};

module.exports = isCourseMember;
