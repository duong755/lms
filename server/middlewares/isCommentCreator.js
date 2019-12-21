/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const commentService = require('../services/Comment');
/**
 * @type {RequestHandler}
 */
const isCommentCreator = async (req, res, next) => {
  const userId = req.session.userId;
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;
  const commentId = req.params.commentId;
  try {
    const result = await commentService.getCommentById(teacherId, courseId, lessonId, commentId);
    if (result.body.found) {
      const comment = result.body._source;
      if (comment.user_id === userId) {
        console.log('hehehehehhe');
        next();
      } else {
        res.status(400).json({ message: 'Not owner this comment' });
      }
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  next();
};

module.exports = isCommentCreator;
