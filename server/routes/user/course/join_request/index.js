const { Router } = require('express');

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
    res.status(500).json({ error: error });
  }
});

/**
 * create join request
 */
joinRequestRouter.post('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/join_request');
});

/**
 * accept join request
 */
joinRequestRouter.post('/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/join_request/:studentId');
});

/**
 * decline join request
 */
joinRequestRouter.delete('/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/join_request/:studentId');
});

module.exports = joinRequestRouter;
