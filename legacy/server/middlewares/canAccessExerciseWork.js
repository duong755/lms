/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const exerciseWorkService = require('../services/ExerciseWork');
/**
 * @type {RequestHandler}
 */
const isExerciseWorkCreator = async (req, res, next) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const exerciseId = req.params.exerciseId;
  const studentId = req.params.studentId;

  const userId = req.session.userId;
  try {
    const result = await exerciseWorkService.getExerciseWorkById(teacherId, courseId, exerciseId, studentId);
    if (result.body.found) {
      const exercisework = result.body._source;
      if (userId === exercisework.student_id || userId === exercisework.teacher_id) {
        next();
      } else {
        res.status(400).json({ message: 'You can not access this exericse work' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'You can not access this exercise work' });
  }
};

module.exports = isExerciseWorkCreator;
