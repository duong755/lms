const { Router } = require('express');

const memberService = require('../../../../services/Member');
const memberRouter = Router({ mergeParams: true });

/**
 * member pagination
 */
memberRouter.get('/', async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;

  try {
    const result = await memberService.getMembersByCourse(teacherId, courseId);
    const members = result.body.hits.hits.map((current) => current._source);
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
memberRouter.delete('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/member');
});

/**
 * remove member
 */
memberRouter.delete('/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/member/:studentId');
});

module.exports = memberRouter;
