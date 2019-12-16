/**
 * @typedef {import('cassandra-driver').types.Uuid} Uuid
 * @typedef {import('cassandra-driver').types.TimeUuid} TimeUuid
 * @typedef {{ id: Uuid | string, question: string, choices: string[], point: number, answer: number }} Quiz
 */

const _ = require('lodash');

const { Exam, elasticsearchClient } = require('../models');

/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {number} [page=1]
 * @param {string | string[]} [includes]
 * @param {string | string[]} [excludes]
 */
function getExamsByCourse(teacherId, courseId, page = 1, includes, excludes) {
  page = _.toInteger(page);
  page = page < 1 ? 1 : page;

  teacherId = String(teacherId);
  courseId = String(courseId);

  return elasticsearchClient.search({
    index: 'lms.exam',
    type: 'exam',
    from: 10 * (page - 1),
    size: 10,
    _source_includes: includes,
    _source_excludes: excludes,
    sort: ['id:desc'],
    body: {
      query: {
        bool: {
          must: [
            {
              term: {
                teacher_id: teacherId
              }
            },
            {
              term: {
                course_id: courseId
              }
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
 * @param {TimeUuid} examId
 * @param {string | string[]} [includes]
 * @param {string | string[]} [excludes]
 */
function getExamById(teacherId, courseId, examId, includes, excludes) {
  teacherId = String(teacherId);
  courseId = String(courseId);
  examId = String(examId);

  const examPrimaryKey = JSON.stringify([teacherId, courseId, examId]);

  return elasticsearchClient.get({
    index: 'lms.exam',
    type: 'exam',
    id: examPrimaryKey,
    _source_includes: includes,
    _source_excludes: excludes
  });
}

/**
 *
 * @param {object} examData
 * @param {Uuid} examData.teacherId
 * @param {Uuid} examData.courseId
 * @param {TimeUuid} examData.examId
 * @param {string} examData.title
 * @param {string} examData.duration
 * @param {number} examData.startAt
 * @param {Quiz[]} examData.content
 * @param {string[]} [fields]
 * @param {boolean} [insert=true]
 * @param {number} [ttl]
 */
function upsertExam(examData, fields, insert = true, ttl) {
  return Exam.insert(
    {
      teacher_id: examData.teacherId,
      course_id: examData.courseId,
      id: examData.examId,
      title: examData.title,
      content: examData.content,
      duration: examData.duration,
      start_at: examData.startAt
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
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {TimeUuid} examId
 * @param {number} [ttl]
 */
function removeExam(teacherId, courseId, examId, ttl) {
  return Exam.remove(
    {
      teacher_id: teacherId,
      course_id: courseId,
      id: examId
    },
    {
      ifExists: true,
      ttl: ttl
    }
  );
}

module.exports = {
  getExamsByCourse: getExamsByCourse,
  getExamById: getExamById,
  upsertExam: upsertExam,
  removeExam: removeExam
};
