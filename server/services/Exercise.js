/**
 * @typedef {import('cassandra-driver').types.Uuid} Uuid
 * @typedef {import('cassandra-driver').types.TimeUuid} TimeUuid
 */

const _ = require('lodash');

const { Exercise, elasticsearchClient } = require('../models');

/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {number} [page=1]
 */
function getExercisesByCourse(teacherId, courseId, page = 1) {
  page = _.toInteger();
  page = page < 1 ? 1 : page;

  teacherId = String(teacherId);
  courseId = String(courseId);

  return elasticsearchClient.search({
    index: 'lms.exercise',
    type: 'exercise',
    from: 10 * (page - 1),
    size: 10,
    sort: ['id:desc'],
    _source_excludes: ['content'],
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
 * @param {TimeUuid} exerciseId
 */
function getExerciseById(teacherId, courseId, exerciseId) {
  teacherId = String(teacherId);
  courseId = String(courseId);
  exerciseId = String(exerciseId);

  const exercisePrimaryKey = JSON.stringify([teacherId, courseId, exerciseId]);

  return elasticsearchClient.get({
    index: 'lms.exercise',
    type: 'exercise',
    id: exercisePrimaryKey
  });
}

/**
 *
 * @param {object} exercise
 * @param {Uuid} exercise.courseId
 * @param {Uuid} exercise.teacherId
 * @param {TimeUuid} exercise.exerciseId
 * @param {string} exercise.content
 * @param {string} exercise.deadline,
 * @param {title} exercise.title
 * @param {string[]} [fields]
 * @param {boolean} [insert=true]
 * @param {number} [ttl]
 */
function upsertExercise(exercise, fields, insert, ttl) {
  return Exercise.insert(
    {
      id: exercise.exerciseId,
      course_id: exercise.courseId,
      content: exercise.content,
      teacher_id: exercise.teacherId,
      title: exercise.title,
      deadline: exercise.deadline
    },
    { ifNotExists: insert, ttl: ttl, fields: fields }
  );
}

/**
 *
 * @param {TimeUuid} id
 * @param {Uuid} courseId
 * @param {Uuid} teacherId
 */
function removeExercise(teacherId, courseId, id) {
  return Exercise.remove(
    {
      id: id,
      course_id: courseId,
      teacher_id: teacherId
    },
    {
      ifExists: true
    }
  );
}

module.exports = {
  getExercisesByCourse: getExercisesByCourse,
  getExerciseById: getExerciseById,
  upsertExercise: upsertExercise,
  removeExercise: removeExercise
};
