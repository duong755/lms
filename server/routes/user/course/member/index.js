/* eslint-disable */
const { Router } = require('express');

const memberService = require('../../../../services/Member');
const userService = require('../../../../services/User');
const isCourseCreator = require('../../../../middlewares/isCourseCreator');
const isCourseMember = require('../../../../middlewares/isCourseMember');
const memberRouter = Router({ mergeParams: true });

/**
 * member pagination
 */
memberRouter.get('/', isCourseCreator, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const page = req.query.page || 1;
  try {
    const result = await memberService.getMembersByCourse(teacherId, courseId, page);
    const members = result.body.hits.hits.map((current) => current._source);
    const userIdArr = members.map((current) => current.student_id);
    const resultGet = await userService.getMultipleUsersById(userIdArr, ['username', 'id']);
    const usernameArr = resultGet.body.hits.hits.map((current) => current._source);
    for (let i = 0; i < members.length; i++) {
      const find = usernameArr.find((element) => element.id === members[i].student_id);
      members[i]['username'] = find.username;
    }
    res.status(200).json({ members: members, total: result.body.hits.total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/member');
});

/**
 * leave course
 */
memberRouter.delete('/', isCourseMember, async (req, res) => {
  const studentId = res.locals.user.id;
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  try {
    const result = await memberService.removeMemberFromCourse(teacherId, courseId, studentId);
    if (result.wasApplied()) {
      res.status(200).json({ successful: true });
    } else {
      res.status(400).json({ error: 'Something wrong' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/member');
});

/**
 * remove member
 */
memberRouter.delete('/:studentId', isCourseCreator, async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;
  try {
    const result = await memberService.removeMemberFromCourse(teacherId, courseId, studentId);
    if (result.wasApplied()) {
      res.status(200).json({ successful: true });
    } else {
      res.status(400).json({ error: 'Can not remove this member' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
  // res.end('/api/user/:userId/course/:courseId/member/:studentId');
});

module.exports = memberRouter;
