/**
 * @typedef {import('cassandra-driver').types.Uuid} Uuid
 * @typedef {import('cassandra-driver').types.TimeUuid} TimeUuid
 */
const _ = require('lodash');

const { cassandraClient, elasticsearchClient } = require('../models');

/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {number} [page=1]
 */
function getMembersByCourse(teacherId, courseId, page = 1) {
  page = _.toInteger(page);
  page = page < 1 ? 1 : page;

  teacherId = String(teacherId);
  courseId = String(courseId);

  return elasticsearchClient.search({
    index: 'lms.member',
    type: 'member',
    from: 10 * (page - 1),
    size: 10,
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
 * @param {Uuid} courseId
 * @param {Uuid} studentId
 */
function removeMemberFromCourse(teacherId, courseId, studentId) {
  const courseTableQuery = `UPDATE course SET members = members - {${String(
    studentId
  )}} WHERE teacher_id = ? AND id = ?`;
  const memberTableQuery = 'DELETE FROM member WHERE teacher_id = ? AND course_id = ? AND student_id = ?';

  return cassandraClient.batch(
    [
      { query: courseTableQuery, params: [teacherId, courseId] },
      { query: memberTableQuery, params: [teacherId, courseId, studentId] }
    ],
    { prepare: true }
  );
}

module.exports = {
  getMembersByCourse: getMembersByCourse,
  removeMemberFromCourse: removeMemberFromCourse
};
