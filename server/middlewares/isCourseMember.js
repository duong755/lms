/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const courseService = require('../services/Course');
/**
 * @type {RequestHandler}
 */
const isCourseMember = async (req, res, next) => {
  const student = res.locals.user;
  try {
    const data = await courseService.getCourseById(req.params.userId, req.params.courseId);
    const members = data.body._source.members;
    if (members.indexOf(student.id) >= 0) {
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
