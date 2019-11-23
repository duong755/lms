const Exam = require('../models/Exercise');
/**
 *
 * @param {object} exam
 * @param {string} exam.courseId
 * @param {'quiz'} exam.content
 * @param {startAt} exam.startAt
 * @param {title} exam.title
 * @param {duration} exam.duration
 * @param {string} exam.id
 */
function createExam(exam) {
  return Exam.insert(
    {
      id: exam.id,
      duration: exam.duration,
      startAt: exam.startAt,
      content: exam.content,
      title: exam.title,
      courseId: exam.courseId
    },
    { ifNotExists: true }
  );
}

/**
 *
 * @param {string} id
 * @param {string} courseId
 * @param {object} exam
 *
 */
function editExam(id, courseId, exam) {
  return Exam.update({
    id: id,
    courseId: courseId,
    content: exam.content,
    title: exam.title,
    duration: exam.duration
  });
}

/**
 *
 * @param {string} id
 * @param {string} courseId
 */
function deleteExam(id, courseId) {
  return Exam.remove({
    id: id,
    courseId: courseId
  });
}

module.exports = {
  createExam,
  editExam,
  deleteExam
};
