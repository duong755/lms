const { Router } = require('express');

const isCourseCreateor = require('../../../../middlewares/isCourseCreator');
const joinRequestService = require('../../../../services/JoinRequest');
const courseService = require('../../../../services/Course');
const userService = require('../../../../services/User');
// const canAccessJoinRequest = require('../../../../middlewares/canAccessJoinRequest');
const joinRequestRouter = Router({ mergeParams: true });

/**
 * join_request pagination
 */

const isStudent = async (req, res, next) => {
  const userId = req.session.userId;
  try {
    const result = await userService.getUserById(userId);
    if (result.body.found) {
      const user = result.body._source;
      if (user.type === 'student') {
        next();
      } else {
        res.status(400).json({ message: 'You are not a student' });
      }
    } else {
      res.status(401).json({ message: 'Unauthenticated' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
};

const notInThisCourse = (req, res, next) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const userId = req.session.userId;
  try {
    const result = courseService.getCourseById(teacherId, courseId);
    const course = result.body._source;
    if (course.members.indexOf(userId) < 0) {
      next();
    } else {
      res.status(400).json({ message: 'You have already in this course' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
};

joinRequestRouter.get('/', isCourseCreateor, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const result = await joinRequestService.getJoinRequests(req.params.userId, req.params.courseId, page);
    const joinRequests = result.body.hits.hits.map((current) => current._source);
    res.status(200).json({ joinRequests: joinRequests, total: result.body.hits.total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

/**
 * create join request
 */
joinRequestRouter.post('/', isStudent, notInThisCourse, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const studentId = res.locals.user.id;
  try {
    const resultCreate = await joinRequestService.createJoinRequest(teacherId, courseId, studentId);
    if (resultCreate.wasApplied()) {
      res.status(200).json({ successful: 'Create new join request successfully' });
    } else {
      res.status(500).json({ error: 'Can not create join request' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
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
      res.status(200).json({ successful: 'Accept join request successfully' });
    } else {
      res.status(500).json({ error: 'Can not accept this join request' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
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
      res.status(200).json({ successful: 'decline join request successfully' });
    } else {
      res.status(500).json({ error: 'Can not decline this join request' });
    }
  } catch (error) {
    console.error();
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/join_request/:studentId');
});

module.exports = joinRequestRouter;
