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
    const members = data.body._source.members;
    if (members.indexOf(userId) >= 0) {
      next();
    } else {
      res.status(400).json({ error: 'you are not in this course' });
    }
  } catch (error) {
    console.error(error);
    res.send(500).json({ error: 'Unexpected error occurred' });
  }
};

module.exports = isCourseMember;
