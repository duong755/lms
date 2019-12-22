/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const reviewService = require('../services/Review');
/**
 * @type {RequestHandler}
 */
const isReviewCreator = async (req, res, next) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const userId = req.session.userId;
  const studentId = req.params.studentId;
  try {
    const result = await reviewService.getReviewById(teacherId, courseId, studentId);
    if (result.body.found) {
      const review = result.body._source;
      if (userId === review.student_id) {
        next();
      } else {
        res.status(400).json({ message: 'Not comment creator' });
      }
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  next();
};

module.exports = isReviewCreator;
