const { Router } = require('express');

const isCourseCreateor = require('../../../../middlewares/isCourseCreator');
const joinRequestService = require('../../../../services/JoinRequest');
const joinRequestRouter = Router({ mergeParams: true });

/**
 * join_request pagination
 */
joinRequestRouter.get('/', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const result = await joinRequestService.getJoinRequests(req.params.userId, req.params.courseId, page);
    const joinRequests = result.body.hits.hits.map((current) => current._source);
    res.status(200).json({ joinRequests: joinRequests, total: result.body.hits.total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
});

/**
 * create join request
 */
joinRequestRouter.post('/', async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const studentId = res.locals.user.id;
  try {
    const resultCreate = await joinRequestService.createJoinRequest(teacherId, courseId, studentId);
    if (resultCreate.wasApplied()) {
      res.status(200).json({ success: 'Create new join request successfully' });
    } else {
      res.status(500).json({ error: 'Can not create join request' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
});

/**
 * accept join request
 */
joinRequestRouter.post('/:studentId', isCourseCreateor, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;
  try {
    const acceptResult = await joinRequestService.acceptJoinRequest(teacherId, courseId, studentId);
    if (acceptResult.wasApplied()) {
      res.status(200).json({ success: 'Accept join request successfully' });
    } else {
      res.status(500).json({ error: 'Can not accept this join request' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/join_request/:studentId');
});

/**
 * decline join request
 */
joinRequestRouter.delete('/:studentId', isCourseCreateor, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;
  try {
    const declineResult = await joinRequestService.declineJoinRequest(teacherId, courseId, studentId);
    if (declineResult.wasApplied()) {
      res.status(200).json({ success: 'decline join request successfully' });
    } else {
      res.status(500).json({ error: 'Can not decline this join request' });
    }
  } catch (error) {
    console.error();
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/join_request/:studentId');
});

module.exports = joinRequestRouter;
