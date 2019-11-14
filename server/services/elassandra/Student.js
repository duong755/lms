const Review = require('../../models/elassandra/Review');
const ExerciseWork = require('../../models/elassandra/ExerciseWork');
const ExamWork = require('../../models/elassandra/ExamWork');
const JoinRequest = require('../../models/elassandra/JoinRequest');
/**
 *
 * @param {object} review
 * @param {string} review.courseId
 * @param {string} review.teacherId
 * @param {string} review.star
 * @param {string} review.createAt
 * @param {string} review.content
 * @param {string} review.studentId
 */
function createReview(review) {
  Review.insert(
    {
      courseId: review.courseId,
      content: review.content,
      star: review.star,
      createAt: Date.now(),
      studentId: review.studentId,
      teacherId: review.teacherId
    },
    {
      ifNotExists: true
    }
  );
}

/**
 *
 * @param {string} courseId
 * @param {string} teacherId
 * @param {string} studentId
 * @param {object} review
 */
function editReview(courseId, teacherId, studentId, review) {
  return Review.update(
    {
      courseId: courseId,
      teacherId: teacherId,
      studentId: studentId,
      content: review.content,
      star: review.star
    },
    {
      ifExists: true
    }
  );
}
/**
 *
 * @param {string} courseId
 * @param {string} teacherId
 * @param {string} studentId
 */
function deleteReview(courseId, teacherId, studentId) {
  return Review.remove({ courseId: courseId, teacherId: teacherId, studentId: studentId }, { ifExists: true });
}

/**
 * @param {object} exerciseWork
 * @param {string} exerciseWork.id
 * @param {string} exerciseWork.studentId
 * @param {number} exerciseWork.points
 * @param {string} exerciseWork.content
 * @param {string} exerciseWork.exerciseId
 */
function submitExercise(exerciseWork) {
  return ExerciseWork.insert(
    {
      id: exerciseWork.id,
      content: exerciseWork.content,
      points: exerciseWork.points,
      studentId: exerciseWork.studentId,
      exerciseId: exerciseWork.exerciseId
    },
    {
      ifNotExists: true
    }
  );
}

/**
 * @param {object} examWork
 * @param {string} examWork.examId
 * @param {string} examWork.studentId
 * @param {object} examWork.content
 * @param {string} examWork.id
 */
function submitExam(examWork) {
  return ExamWork.insert(
    {
      id: examWork.id,
      content: examWork.content,
      studentId: examWork.studentId,
      examId: examWork.examId
    },
    {
      ifNotExists: true
    }
  );
}
/**
 * @param {object} joinRequest
 * @param {string} joinRequest.courseId,
 * @param {string} joinRequest.studentId,
 * @param {string} joinRequest.teacherId
 * @param {string} joinRequest.createAt
 */
function createJoinRequest(joinRequest) {
  return JoinRequest.insert(
    {
      courseId: joinRequest.courseId,
      studentId: joinRequest.studentId,
      teacherId: joinRequest.teacherId,
      createAt: Date.now()
    },
    {
      ifNotExists: true
    }
  );
}

module.exports = {
  createReview,
  editReview,
  deleteReview,
  submitExercise,
  submitExam,
  createJoinRequest
};
