const { JoinRequest, cassandraClient } = require('../../models/elassandra');

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
function acceptJoinRequest(teacherId, courseId, studentId, ttl) {
  const timeToLive = typeof ttl === 'number' ? `USING TTL ${ttl}` : '';

  const deleteJoinRequest = 'DELETE FROM join_request WHERE teacher_id = ? AND course_id = ? AND student_id = ?';
  const insertMemberTable = `INSERT INTO member(teacher_id, course_id, student_id, joined_at) VALUES (?, ?, ?, ?) ${timeToLive}`;
  const editCourseMember = `UPDATE course ${timeToLive} SET members = members + {${studentId.toString()}} WHERE teacher_id = ? AND id = ?`;

  console.log(deleteJoinRequest, insertMemberTable, editCourseMember);

  return cassandraClient.batch(
    [
      {
        query: deleteJoinRequest,
        params: [teacherId, courseId, studentId]
      },
      {
        query: insertMemberTable,
        params: [teacherId, courseId, studentId, Date.now()]
      },
      {
        query: editCourseMember,
        params: [teacherId, courseId]
      }
    ],
    { prepare: true }
  );
}

/**
 *
 * @param {import('cassandra-driver').types.Uuid} teacherId
 * @param {import('cassandra-driver').types.Uuid} courseId
 * @param {import('cassandra-driver').types.Uuid} studentId
 * @param {number} [ttl]
 */
function declineJoinRequest(teacherId, courseId, studentId, ttl) {
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
  acceptJoinRequest: acceptJoinRequest,
  declineJoinRequest: declineJoinRequest
};
