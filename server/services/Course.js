/**
 * @typedef {import('cassandra-driver').types.Uuid} Uuid
 * @typedef {import('cassandra-driver').types.TimeUuid} TimeUuid
 */

const _ = require('lodash');

const { Course, elasticsearchClient } = require('../models');

/**
 *
 * @param {object} course
 * @param {Uuid} course.teacherId
 * @param {Uuid} course.courseId
 * @param {string} course.description
 * @param {string[]} course.topics
 * @param {string} course.courseName
 * @param {boolean} [course.archive=false]
 * @param {string[]} [course.members=[]]
 * @param {string[]} [fields]
 * @param {boolean} [insert=true]
 * @param {number} [ttl]
 */
function upsertCourse(course, fields, insert, ttl) {
  return Course.insert(
    {
      id: course.courseId,
      teacherId: course.teacherId,
      description: course.description,
      courseName: course.courseName,
      createdAt: Date.now(),
      topics: course.topics,
      archive: course.archive,
      members: course.members
    },
    {
      ifNotExists: insert,
      ttl: ttl,
      fields: fields
    }
  );
}

/**
 *
 * @param {Uuid} studentId
 * @param {number} [page=1]
 */
function getCoursesByStudent(studentId, page = 1) {
  page = _.toInteger(page);
  page = page < 1 ? 1 : page;

  studentId = String(studentId);

  return elasticsearchClient.search({
    index: 'lms.course',
    type: 'course',
    from: 10 * (page - 1),
    size: 10,
    body: {
      query: {
        bool: {
          must: [{ term: { members: studentId } }]
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
function getCoursesByTeacher(teacherId, page = 1) {
  page = _.toInteger(page);
  page = page < 1 ? 1 : page;

  teacherId = String(teacherId);

  return elasticsearchClient.search({
    index: 'lms.course',
    type: 'course',
    from: 10 * (page - 1),
    size: 10,
    body: {
      query: {
        bool: {
          must: [{ term: { teacher_id: teacherId } }]
        }
      }
    }
  });
}

/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 */
function getCourseById(teacherId, courseId) {
  teacherId = String(teacherId);
  courseId = String(courseId);

  const coursePrimaryKey = JSON.stringify([teacherId, courseId]);

  return elasticsearchClient.get({
    index: 'lms.course',
    type: 'course',
    id: coursePrimaryKey
  });
}

module.exports = {
  upsertCourse: upsertCourse,
  getCoursesByStudent: getCoursesByStudent,
  getCoursesByTeacher: getCoursesByTeacher,
  getCourseById: getCourseById
};
