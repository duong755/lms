const Course = require('../../models/elassandra/Course');
const Lesson = require('../../models/elassandra/Lesson');
const Exercise = require('../../models/elassandra/Exercise');
const Exam = require('../../models/elassandra/Exam');

const { cassandraTypes } = require('../../models/elassandra/connector');

const Uuid = cassandraTypes.Uuid;
const TimeUuid = cassandraTypes.TimeUuid;
/**
 *
 * @param {object} course
 * @param {string} course.teacherId
 * @param {string} course.id
 * @param {string} course.description
 * @param {string} course.teacherName
 * @param {Array} course.topics
 * @param {string} course.courseName
 * @param {string} course.createdAt
 * @param {boolean} course.archive
 */
function createCourse(course) {
  return Course.insert({
    id: Uuid.random(),
    teacherId: course.teacherId,
    description: course.description,
    courseName: course.courseName,
    createdAt: Date.now(),
    topics: course.topics,
    archive: course.archive,
    teacherName: course.teacherName
  });
}
// const newCourse = {
//   teacherId: Uuid.random(),
//   description: 'dcm INT3306',
//   archive: true,
//   courseName: 'INT3306',
//   topics: ['ab', 'cd', 'ef'],
//   teacherName: 'nxuanhoang'
// };
// createCourse(newCourse)
//   .then(console.log)
//   .catch(console.error);

/**
 *
 * @param {object} content
 * @param {string} content.description
 * @param {string} content.courseName
 * @param {boolean} content.archive
 * @param {string} courseId
 * @param {string} teacherId
 */
function editCourse(courseId, teacherId, content) {
  return Course.update(
    {
      id: courseId,
      teacherId: teacherId,
      description: content.description,
      courseName: content.courseName,
      archive: content.archive
    },
    { ifExists: true }
  );
}

// const content = {
//   description: '你好',
//   courseName: '阮春黄',
//   archive: false
// };
// editCourse('321a96ea-7c13-4c47-89a6-b59a5dc88cbe', '06099a79-1884-407a-bc15-d6760230ed8b', content)
//   .then(console.log)
//   .catch(console.error);

/**
 *
 * @param {object} lesson
 * @param {string} lesson.courseId
 * @param {string} lesson.teacherId
 * @param {string} lesson.content
 * @param {string} lesson.id
 * @param {string} lesson.title
 */
function createLesson(lesson) {
  return Lesson.insert({
    courseId: lesson.courseId,
    id: lesson.id,
    title: lesson.title,
    teacherId: lesson.teacherId,
    content: lesson.content
  });
}

// const lesson = {
//   courseId: Uuid.random(),
//   id: TimeUuid.now(Date.now()),
//   teacherId: Uuid.random(),
//   content: 'This is a lesson',
//   title: 'the same content'
// };

// createLesson(lesson)
//   .then(console.log)
//   .catch(console.error);
/**
 *
 * @param {string} courseId
 * @param {string} teacherId
 * @param {object} newLesson
 */
function editLesson(courseId, teacherId, id, newLesson) {
  return Lesson.update({
    courseId: courseId,
    teacherId: teacherId,
    id: id,
    content: newLesson.content,
    title: newLesson.title
  });
}

// editLesson(
//   'b41ff5e7-26aa-40a3-9562-a5acd9fa2b82',
//   '91305b2e-b70b-4726-ab42-f4dc41896dff',
//   '10b68430-063d-11ea-8f5a-afa964d3425d',
//   {
//     content: 'this is new Content'
//   }
// )
//   .then(console.log)
//   .catch(console.error);

function deleteLesson(courseId, teacherId, id) {
  return Lesson.remove(
    {
      courseId: courseId,
      teacherId: teacherId,
      id: id
    },
    { ifExists: true }
  );
}

// deleteLesson(
//   '2003c0ce-f384-4b1e-a66f-4dc32801a889',
//   '8fbb2332-7b10-4b46-905b-561cfe8ecc61',
//   'f7e56450-0644-11ea-95ea-147fe9d45ec0'
// )
//   .then(console.log)
//   .catch(console.error);

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

// createExam({
//   id: TimeUuid.now(),
//   duration: '90p',
//   startAt: Date.now(),
//   content: [{ question: 'abc', choices: ['a', 'b', 'c', 'd'] }, { question: 'def', choices: ['a1', 'b1', 'c1', 'd1'] }],
//   title: 'this is a title',
//   courseId: Uuid.random()
// })
//   .then(console.log)
//   .catch(console.error);
/**
 *
 * @param {string} id
 * @param {string} courseId
 * @param {object} exam
 * Không thể ghi đè nội dung cũ nên là bắt buộc phải gửi 1 state có cả dữ liệu không thay đổi và thay đổi để cập nhật
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

// editExam('1b64e660-064c-11ea-af74-3d4040ac0c16', '70c188e5-5b17-4114-b8b0-2cada60adcee', {
//   content: [{ question: 'abc', choices: ['a2', 'b2', 'c2', 'd2'] }]
// })
//   .then(console.log)
//   .catch(console.error);

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
  createCourse,
  editCourse,
  createLesson,
  editLesson,
  deleteLesson,
  createExercise,
  editExercise,
  deleteExercise,
  createExam,
  editExam,
  deleteExam
};
