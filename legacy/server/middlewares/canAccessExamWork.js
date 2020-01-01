/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const examWorkService = require('../services/ExamWork');
/**
 * @type {RequestHandler}
 */
const canAccessExamWork = async (req, res, next) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const examId = req.params.examId;
  const studentId = req.params.studentId;

  const userId = req.session.userId;
  try {
    const result = await examWorkService.getExamWorkByStudent(teacherId, courseId, examId, studentId);
    if (result.body.found) {
      const examwork = result.body._source;
      if (userId === examwork.student_id || userId === examwork.teacher_id) {
        next();
      } else {
        res.status(400).json({ message: 'You can not access this exam work' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'You can not access this exam work' });
  }
};

module.exports = canAccessExamWork;
