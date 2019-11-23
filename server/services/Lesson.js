const Lesson = require('../models/Lesson');
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

module.export = {
  createLesson,
  editLesson,
  deleteLesson
};
