/**
 * @typedef {import('cassandra-driver').types.Uuid} Uuid
 */

const _ = require('lodash');

const { Review, elasticsearchClient } = require('../models');

/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {number} page
 */
function getReviews(teacherId, courseId, page = 1) {
  page = _.toInteger(page);
  page = page < 1 ? 1 : page;

  teacherId = String(teacherId);
  courseId = String(courseId);

  return elasticsearchClient.search({
    index: 'lms.review',
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
      },
      from: (page - 1) * 10,
      size: 10
    }
  });
}

/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {Uuid} studentId
 * @param {string} content
 * @param {number} [star]
 * @param {number} [ttl]
 */
function upsertReview(teacherId, courseId, studentId, content, star = 4, ttl) {
  star = _.toInteger(star);
  if (star < 1 || star > 5) {
    star = 4;
  }

  return Review.insert(
    {
      teacherId: teacherId,
      courseId: courseId,
      studentId: studentId,
      createdAt: Date.now(),
      content: content,
      star: star
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
 *
 */
function deleteReview(teacherId, courseId, studentId) {
  return Review.remove(
    {
      teacherId: teacherId,
      courseId: courseId,
      studentId: studentId
    },
    {
      ifExists: true
    }
  );
}

module.exports = {
  getReviews: getReviews,
  upsertReview: upsertReview,
  deleteReview: deleteReview
};
