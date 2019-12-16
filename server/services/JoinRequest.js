/**
 * @typedef {import('cassandra-driver').types.Uuid} Uuid
 */

const _ = require('lodash');

const { JoinRequest, cassandraClient, elasticsearchClient } = require('../models');

/**
 *
 * @param {string} teacherId
 * @param {string} courseId
 * @param {number} [page=1]
 */
function getJoinRequestsByCourse(teacherId, courseId, page = 1) {
  page = _.toInteger(page);
  page = page < 1 ? 1 : page;

  teacherId = String(teacherId);
  courseId = String(courseId);

  return elasticsearchClient.search({
    index: 'lms.join_request',
    type: 'join_request',
    from: 10 * (page - 1),
    size: 10,
    sort: ['request_at:desc'],
    body: {
      query: {
        bool: {
          must: [
            {
              term: { teacher_id: teacherId }
            },
            {
              term: { course_id: courseId }
            }
          ]
        }
      }
    }
  });
}

/**
 *
 * @param {Uuid} teacherId
 * @param {number} [page=1]
 */
function getJoinRequestsByTeacher(teacherId, page = 1) {
  page = _.toInteger(page);
  page = page < 1 ? 1 : page;

  teacherId = String(teacherId);

  return elasticsearchClient.search({
    index: 'lms.join_request',
    type: 'join_request',
    from: 10 * (page - 1),
    size: 10,
    sort: ['request_at:desc'],
    body: {
      query: {
        term: { teacher_id: teacherId }
      }
    }
  });
}

/**
 *
 * @param {Uuid} studentId
 * @param {number} [page=1]
 */
function getJoinRequestsByStudent(studentId, page = 1) {
  page = _.toInteger(page);
  page = page < 1 ? 1 : page;

  studentId = String(studentId);

  return elasticsearchClient.search({
    index: 'lms.join_request',
    type: 'join_request',
    from: 10 * (page - 1),
    size: 10,
    sort: ['request_at:desc'],
    body: {
      query: {
        term: {
          student_id: studentId
        }
      }
    }
  });
}

/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {Uuid} studentId
 */
function getJoinRequestById(teacherId, courseId, studentId) {
  teacherId = String(teacherId);
  courseId = String(courseId);
  studentId = String(studentId);

  const joinRequestPrimaryKey = JSON.stringify([teacherId, courseId, studentId]);

  return elasticsearchClient.get({
    index: 'lms.join_request',
    type: 'join_request',
    id: joinRequestPrimaryKey
  });
}

/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {Uuid} studentId
 * @param {number} [ttl]
 */
function createJoinRequest(teacherId, courseId, studentId, ttl) {
  return JoinRequest.insert(
    {
      teacher_id: teacherId,
      course_id: courseId,
      student_id: studentId,
      request_at: Date.now()
    },
    {
      ifNotExists: false,
      ttl: ttl
    }
  );
}

/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {Uuid} studentId
 * @param {number} [ttl]
 */
function acceptJoinRequest(teacherId, courseId, studentId, ttl) {
  const timeToLive = typeof ttl === 'number' ? `USING TTL ${ttl}` : '';

  const deleteJoinRequest = 'DELETE FROM join_request WHERE teacher_id = ? AND course_id = ? AND student_id = ?';
  const insertMemberTable = `INSERT INTO member(teacher_id, course_id, student_id, joined_at) VALUES (?, ?, ?, ?) ${timeToLive}`;
  const editCourseMember = `UPDATE course ${timeToLive} SET members = members + {${studentId.toString()}} WHERE teacher_id = ? AND id = ?`;

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
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {Uuid} studentId
 * @param {number} [ttl]
 */
function declineJoinRequest(teacherId, courseId, studentId, ttl) {
  return JoinRequest.remove(
    {
      teacher_id: teacherId,
      course_id: courseId,
      student_id: studentId
    },
    {
      ifExists: true,
      ttl: ttl
    }
  );
}

module.exports = {
  getJoinRequestsByCourse: getJoinRequestsByCourse,
  getJoinRequestsByStudent: getJoinRequestsByStudent,
  getJoinRequestsByTeacher: getJoinRequestsByTeacher,
  getJoinRequestById: getJoinRequestById,
  createJoinRequest: createJoinRequest,
  acceptJoinRequest: acceptJoinRequest,
  declineJoinRequest: declineJoinRequest
};
