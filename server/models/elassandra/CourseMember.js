const { mapper } = require('./connector');

module.exports = mapper(['course_member', 'student_join_course'], 'CourseMember').forModel('CourseMember');
