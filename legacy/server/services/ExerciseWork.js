/**
 * @typedef {import('cassandra-driver').types.Uuid} Uuid
 * @typedef {import('cassandra-driver').types.TimeUuid} TimeUuid
 * @typedef {{ question: string, choices: string[], answer: number, point: number }} Quiz
 */

const { ExerciseWork, elasticsearchClient } = require('../models');

/**
 *
 * @param {Uuid} teacherId
 * @param {Uuid} courseId
 * @param {TimeUuid} exerciseId
 * @param {number} [page=1]
 * @param {string | string[]} [includes]
 * @param {string | string[]} [excludes]
 */
function getExerciseWorksByExercise(teacherId, courseId, exerciseId, page = 1, includes, excludes) {
  teacherId = String(teacherId);
  courseId = String(courseId);
  exerciseId = String(exerciseId);

  return elasticsearchClient.search({
    index: 'lms.exercise_work',
    type: 'exercise_work',
    _source_includes: includes,
    _source_excludes: excludes,
    from: 10 * (page - 1),
    size: 10,
    body: {
      query: {
        bool: {
          must: [
            {
              term: { teacher_id: teacherId }
            },
            {
              term: { course_id: courseId }
            },
            {
              term: { exercise_id: exerciseId }
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
 * @param {Uuid} studentId
 */
function getExerciseWorkById(teacherId, courseId, exerciseId, studentId) {
  teacherId = String(teacherId);
  courseId = String(courseId);
  exerciseId = String(exerciseId);
  studentId = String(studentId);

  const exerciseWorkPrimaryKey = JSON.stringify([teacherId, courseId, exerciseId, studentId]);

  return elasticsearchClient.get({
    index: 'lms.exercise_work',
    type: 'exercise_work',
    id: exerciseWorkPrimaryKey
  });
}

/**
 *
 * @param {object} exerciseWorkData
 * @param {Uuid} exerciseWorkData.teacherId
 * @param {Uuid} exerciseWorkData.courseId
 * @param {TimeUuid} exerciseWorkData.exerciseId
 * @param {Uuid} exerciseWorkData.studentId
 * @param {string} exerciseWorkData.content
 * @param {number} exerciseWorkData.point
 * @param {string[]} [fields]
 * @param {boolean} [insert=true]
 * @param {number} [ttl]
 */
function upsertExerciseWork(exerciseWorkData, fields, insert, ttl) {
  return ExerciseWork.insert(
    {
      teacher_id: exerciseWorkData.teacherId,
      course_id: exerciseWorkData.courseId,
      exercise_id: exerciseWorkData.exerciseId,
      student_id: exerciseWorkData.studentId,
      content: exerciseWorkData.content,
      point: exerciseWorkData.point,
      submit_at: Date.now()
    },
    {
      ifNotExists: insert,
      fields: fields,
      ttl: ttl
    }
  );
}

module.exports = {
  getExerciseWorksByExercise: getExerciseWorksByExercise,
  getExerciseWorkById: getExerciseWorkById,
  upsertExerciseWork: upsertExerciseWork
};
