const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "exam_work" (
//     "course_id" uuid,
//     "teacher_id" uuid,
//     "exam_id" timeuuid,
//     "student_id" uuid,
//     "content" set<frozen<quiz>>,
//     "submit" timeuuid,
//     "point" float,
//     PRIMARY KEY (("teacher_id", "course_id", "exam_id"), "student_id")
// );
module.exports = mapper(['exam_work'], 'ExamWork').forModel('ExamWork');
