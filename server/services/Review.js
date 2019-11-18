const _ = require('lodash');

const { Review, elasticsearchClient } = require('../models');

/**
 *
 * @param {import('cassandra-driver').types.Uuid | string} teacherId
 * @param {import('cassandra-driver').types.Uuid | string} courseId
 * @param {number} page
 */
function getReviews(teacherId, courseId, page = 1) {
  page = _.toInteger(page);
  page = page < 1 ? 1 : page;

  teacherId = teacherId.toString();
  courseId = courseId.toString();

  return elasticsearchClient.search({
    index: 'lms.review',
    body: {
      query: {
        bool: {
          must: [
            {
              match: { teacher_id: teacherId }
            },
            {
              match: { course_id: courseId }
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
 * @param {import('cassandra-driver').types.Uuid} teacherId
 * @param {import('cassandra-driver').types.Uuid} courseId
 * @param {import('cassandra-driver').types.Uuid} studentId
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
 * @param {import('cassandra-driver').types.Uuid} teacherId
 * @param {import('cassandra-driver').types.Uuid} courseId
 * @param {import('cassandra-driver').types.Uuid} studentId
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
