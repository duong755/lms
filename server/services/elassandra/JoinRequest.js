const { JoinRequest } = require('../../models/elassandra');

/**
 *
 * @param {import('cassandra-driver').types.Uuid} teacherId
 * @param {import('cassandra-driver').types.Uuid} courseId
 * @param {import('cassandra-driver').types.Uuid} studentId
 * @param {number} [ttl]
 */
function createJoinRequest(teacherId, courseId, studentId, ttl) {
  return JoinRequest.insert(
    {
      teacherId: teacherId,
      courseId: courseId,
      studentId: studentId,
      requestAt: Date.now()
    },
    {
      ifNotExists: false,
      ttl: ttl
    }
  );
}

/**
 *
 * @param {import('cassandra-driver').types.Uuid} teacherId
 * @param {import('cassandra-driver').types.Uuid} courseId
 * @param {import('cassandra-driver').types.Uuid} studentId
 * @param {number} [ttl]
 */
function deleteJoinRequest(teacherId, courseId, studentId, ttl) {
  return JoinRequest.remove(
    {
      teacherId: teacherId,
      courseId: courseId,
      studentId: studentId
    },
    {
      ifExists: true,
      ttl: ttl
    }
  );
}

module.exports = {
  createJoinRequest: createJoinRequest,
  deleteJoinRequest: deleteJoinRequest
};
