import _ from 'lodash';

import { Comment, elasticsearchClient } from '../models';

/**
 *
 * @param {import('cassandra-driver').types.Uuid} teacherId
 * @param {import('cassandra-driver').types.Uuid} courseId
 * @param {import('cassandra-driver').types.TimeUuid} lessonId
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
 * @param {import('cassandra-driver').types.Uuid} commentData.teacherId
 * @param {import('cassandra-driver').types.Uuid} commentData.courseId
 * @param {import('cassandra-driver').types.TimeUuid} commentData.lessonId
 * @param {import('cassandra-driver').types.TimeUuid} commentData.commentId
 * @param {import('cassandra-driver').types.Uuid} commentData.userId
 * @param {string} commentData.content
 * @param {boolean} [insert=true]
 * @param {number} [ttl]
 */
function upsertComment(commentData, insert, ttl) {
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
      ttl: ttl
    }
  );
}

/**
 *
 * @param {import('cassandra-driver').types.Uuid} teacherId
 * @param {import('cassandra-driver').types.Uuid} courseId
 * @param {import('cassandra-driver').types.TimeUuid} lessonId
 * @param {import('cassandra-driver').types.TimeUuid} commentId
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

module.exports = {
  getCommentsByLesson: getCommentsByLesson,
  upsertComment: upsertComment,
  removeComment: removeComment
};
