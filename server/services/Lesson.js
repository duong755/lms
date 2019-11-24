/**
 * @typedef {import('cassandra-driver').types.Uuid} Uuid
 * @typedef {import('cassandra-driver').types.TimeUuid} TimeUuid
 */

const _ = require('lodash');

const { Lesson, elasticsearchClient } = require('../models');

/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {number} [page=1]
 */
function getLessonsByTeacherAndCourse(teacherId, courseId, page = 1) {
  page = _.toInteger(page);
  page = page < 1 ? 1 : page;

  teacherId = String(teacherId);
  courseId = String(courseId);

  return elasticsearchClient.search({
    index: 'lms.lesson',
    type: 'lesson',
    from: 10 * (page - 1),
    size: 10,
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
 * @param {TimeUuid} lessonId
 */
function getLessonById(teacherId, courseId, lessonId) {
  teacherId = String(teacherId);
  courseId = String(courseId);
  lessonId = String(lessonId);

  const _id = JSON.stringify([teacherId, courseId, lessonId]);

  return elasticsearchClient.get({
    index: 'lms.lesson',
    type: 'lesson',
    id: _id
  });
}

/**
 *
 * @param {object} lessonData
 * @param {Uuid} lessonData.teacherId
 * @param {Uuid} lessonData.courseId
 * @param {TimeUuid} lessonData.id
 * @param {string} lessonData.title
 * @param {string} lessonData.content
 * @param {string[]} [fields]
 * @param {boolean} [insert=true]
 * @param {number} [ttl]
 */
function upsertLesson(lessonData, fields, insert = true, ttl) {
  return Lesson.insert(
    {
      teacher_id: lessonData.teacherId,
      course_id: lessonData.courseId,
      id: lessonData.id,
      title: lessonData.title,
      content: lessonData.content
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
 * @param {TimeUuid} id
 * @param {number} [ttl]
 */
function removeLesson(teacherId, courseId, id, ttl) {
  return Lesson.remove(
    {
      teacher_id: teacherId,
      course_id: courseId,
      id: id
    },
    {
      ifExists: true,
      ttl: ttl
    }
  );
}

module.exports = {
  getLessonsByTeacherAndCourse: getLessonsByTeacherAndCourse,
  getLessonById: getLessonById,
  upsertLesson: upsertLesson,
  removeLesson: removeLesson
};
