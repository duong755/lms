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
 * @param {object} reviewData
 * @param {Uuid} reviewData.teacherId
 * @param {Uuid} reviewData.courseId
 * @param {Uuid} reviewData.studentId
 * @param {string} reviewData.content
 * @param {number} [reviewData.star]
 * @param {string[]} [fields]
 * @param {boolean} [insert=true]
 * @param {number} [ttl]
 */
function upsertReview(reviewData, fields, insert = false, ttl) {
  reviewData.star = _.toInteger(reviewData.star);
  if (reviewData.star < 1 || reviewData.star > 5) {
    reviewData.star = 4;
  }

  return Review.insert(
    {
      teacher_id: reviewData.teacherId,
      course_id: reviewData.courseId,
      student_id: reviewData.studentId,
      created_at: Date.now(),
      content: reviewData.content,
      star: reviewData.star
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
 * @param {Uuid} studentId
 *
 */
function deleteReview(teacherId, courseId, studentId) {
  return Review.remove(
    {
      teacher_id: teacherId,
      course_id: courseId,
      student_id: studentId
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
