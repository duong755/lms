/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const joinRequestService = require('../services/JoinRequest');
/**
 * @type {RequestHandler}
 */
const canAccessJoinRequest = async (req, res, next) => {
  const userId = req.session.userId;
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  try {
    const result = await joinRequestService.getJoinRequestById(teacherId, courseId, userId);
    if (result.body.found) {
      next();
    } else {
      res.status(404).json({ message: 'Not Found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
};

module.exports = canAccessJoinRequest;
