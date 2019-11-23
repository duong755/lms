/**
 * @typedef {import('cassandra-driver').types.Uuid} Uuid
 * @typedef {import('cassandra-driver').types.TimeUuid} TimeUuid
 */

const _ = require('lodash');

const { Comment, elasticsearchClient } = require('../models');

/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {TimeUuid} lessonId
 * @param {number} [page=1]
 */
function getCommentsByLesson(teacherId, courseId, lessonId, page = 1) {
  page = _.toInteger(page);
  page = page < 1 ? 1 : page;

  teacherId = String(teacherId);
  courseId = String(courseId);
  lessonId = String(lessonId);

  return elasticsearchClient.search({
    index: 'lms.comment',
    type: 'comment',
    from: 10 * (page - 1),
    size: 10,
    sort: ['id:desc'],
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                teacher_id: teacherId
              }
            },
            {
              match: {
                course_id: courseId
              }
            },
            {
              match: {
                lesson_id: lessonId
              }
            }
          ]
        }
      }
    }
  });
}

/**
 * @param {object} commentData,
 * @param {Uuid} commentData.teacherId
 * @param {Uuid} commentData.courseId
 * @param {TimeUuid} commentData.lessonId
 * @param {TimeUuid} commentData.commentId
 * @param {Uuid} commentData.userId
 * @param {string} commentData.content
 * @param {string[]} [fields]
 * @param {boolean} [insert=true]
 * @param {number} [ttl]
 */
function upsertComment(commentData, fields, insert, ttl) {
  return Comment.insert(
    {
      teacher_id: commentData.teacherId,
      course_id: commentData.courseId,
      lesson_id: commentData.lessonId,
      user_id: commentData.userId,
      id: commentData.commentId,
      content: commentData.content
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
 * @param {TimeUuid} lessonId
 * @param {TimeUuid} commentId
 * @param {number} [ttl]
 */
function removeComment(teacherId, courseId, lessonId, commentId, ttl) {
  return Comment.remove(
    {
      teacher_id: teacherId,
      course_id: courseId,
      lesson_id: lessonId,
      id: commentId
    },
    {
      ifExists: true,
      ttl: ttl
    }
  );
}

exports.upsertComment = upsertComment;

module.exports.removeComment = removeComment;
module.exports.upsertComment = upsertComment;
module.exports.getCommentsByLesson = getCommentsByLesson;
