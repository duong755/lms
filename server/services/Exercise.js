const Exercise = require('../models/Exercise');

/**
 *
 * @param {object} exercise
 * @param {string} exercise.courseId
 * @param {string} exercise.teacherId
 * @param {string} exercise.content
 * @param {string} exercise.id
 * @param {string} exercise.deadline,
 * @param {title} exercise.title
 */
function createExercise(exercise) {
  return Exercise.insert(
    {
      id: exercise.id,
      courseId: exercise.courseId,
      cotent: exercise.content,
      teacherId: exercise.teacherId,
      title: exercise.title,
      deadline: exercise.deadline
    },
    { ifNotExists: true }
  );
}
/**
 *
 * @param {object} id
 * @param {string} courseId
 * @param {string} teacherId
 * @param {string} newExercise
 */
function editExercise(id, courseId, teacherId, newExercise) {
  return Exercise.update(
    {
      id: id,
      courseId: courseId,
      teacherId: teacherId,
      title: newExercise.title,
      content: newExercise.content
    },
    {
      ifExists: true
    }
  );
}

/**
 *
 * @param {object} id
 * @param {string} courseId
 * @param {string} teacherId
 */
function deleteExercise(id, courseId, teacherId) {
  return Exercise.remove(
    {
      id: id,
      courseId: courseId,
      teacherId: teacherId
    },
    {
      ifExists: true
    }
  );
}

module.exports = {
  createExercise,
  editExercise,
  deleteExercise
};
