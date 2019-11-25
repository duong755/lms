/**
 * @typedef {import('cassandra-driver').types.Uuid} Uuid
 * @typedef {import('cassandra-driver').types.TimeUuid} TimeUuid
 * @typedef {{ question: string, choices: string[], answer: number, point: number }} Quiz
 */
const _ = require('lodash');

const { ExamWork, elasticsearchClient } = require('../models');

/**
 *
 * @param {object} examwork
 * @param {Uuid} examwork.studentId
 * @param {Uuid} examwork.teacherId
 * @param {Uuid} examwork.examId
 * @param {Uuid} examwork.courseId
 * @param {Quiz[]} examwork.content
 * @param {number} examwork.point
 * @param {number} examwork.submitAt
 * @param {string[]} [fields]
 * @param {boolean} [insert=true]
 * @param {number} [ttl]
 */
function upsertExamWork(examwork, fields, insert, ttl) {
  return ExamWork.insert(
    {
      studentId: examwork.studentId,
      teacherId: examwork.teacherId,
      examId: examwork.examId,
      courseId: examwork.courseId,
      point: examwork.point,
      submit: examwork.submit,
      content: examwork.content,
      submitAt: examwork.submitAt
    },
    { ifNotExists: insert, fields: fields, ttl: ttl }
  );
}

/**
 *
 * @param {Uuid} studentId
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {TimeUuid} examId
 */
function getExamWorkByStudent(teacherId, courseId, examId, studentId) {
  studentId = String(studentId);
  teacherId = String(teacherId);
  courseId = String(courseId);
  examId = String(examId);

  const key = JSON.stringify([teacherId, courseId, examId, studentId]);

  return elasticsearchClient.get({
    index: 'lms.exam_work',
    type: 'exam_work',
    id: key
  });
}
/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {TimeUuid} examId
 * @param {number} page
 */
function getExamWorksByExam(teacherId, courseId, examId, page = 1) {
  page = page < 1 ? 1 : page;
  page = _.toInteger(page);

  teacherId = String(teacherId);
  courseId = String(courseId);
  examId = String(examId);

  return elasticsearchClient.search({
    index: 'lms.exam_work',
    type: 'exam_work',
    from: 10 * (page - 1),
    size: 10,
    body: {
      query: {
        bool: {
          must: [{ term: { teacher_id: teacherId } }, { term: { course_id: courseId } }, { term: { exam_id: examId } }]
        }
      }
    }
  });
}

module.exports = {
  upsertExamWork: upsertExamWork,
  getExamWorkByStudent: getExamWorkByStudent,
  getExamWorksByExam: getExamWorksByExam
};
