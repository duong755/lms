const Course = require('../models/Course');
const { elasticsearchClient } = require('../models');
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
 * @param {Array} course.members
 * @param {boolean} course.archive
 */
function createCourse(course) {
  return Course.insert({
    id: course.id,
    teacherId: course.teacherId,
    description: course.description,
    courseName: course.courseName,
    createdAt: Date.now(),
    topics: course.topics,
    archive: course.archive,
    members: course.members,
    teacherName: course.teacherName
  });
}

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
/**
 *
 * @param {string} studentId
 * @param {number} page
 */
function getCourseByStudentId(studentId, page = 1) {
  page = page < 1 ? 1 : page;
  return elasticsearchClient.get({
    index: 'lms.course',
    body: {
      query: {
        bool: {
          must: [{ match: { members: studentId } }]
        }
      }
    },
    from: (page - 1) * 10,
    size: 10
  });
}

// getCourseByStudentId('810c1f16-7bc1-4245-9121-0a93c3901517')
//   .then((result) => console.log(result))
//   .catch(console.error);
/**
 *
 * @param {string} teacherId
 * @param {number} page
 */
function getCourseByTeacherId(teacherId, page = 1) {
  page = page < 1 ? 1 : page;
  return elasticsearchClient.search({
    index: 'lms.course',
    body: {
      query: {
        bool: {
          must: [{ match: { teacher_id: teacherId } }]
        }
      }
    },
    from: (page - 1) * 10,
    size: 10
  });
}

// getCourseByTeacherId('47aaa4c9-2a78-4c9f-a8b9-342822515978')
//   .then((result) => console.log(result.body.hits.hits))
//   .catch(console.error);
/**
 *
 * @param {string} courseId
 */
function getCourseByCourseId(courseId) {
  courseId = courseId.toString();
  return elasticsearchClient.search({
    index: 'lms.course',
    body: {
      query: {
        bool: {
          must: [{ match: { id: courseId } }]
        }
      }
    }
  });
}

// getCourseByCourseId('568d0fc6-5598-4a3c-ad55-283a678f0a35')
//   .then((result) => console.log(result.body.hits.hits))
//   .catch(console.error);

module.exports = {
  createCourse,
  editCourse,
  getCourseByStudentId,
  getCourseByTeacherId,
  getCourseByCourseId
};
