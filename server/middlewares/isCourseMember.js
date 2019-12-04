/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const courseService = require('../services/Course');
/**
 * @type {RequestHandler}
 */
const isCourseMember = async (req, res, next) => {
  const user = res.locals.user;
  try {
    const data = await courseService.getCourseById(req.params.userId, req.params.courseId);
    const members = data.body._source.members;
    if (members.indexOf(user.id) >= 0) {
      next();
    } else {
      res.status(400).json({ error: 'you are not in this course' });
    }
  } catch (error) {
    res.send(500).json({ error: error });
  }

  next();
};

module.exports = isCourseMember;
