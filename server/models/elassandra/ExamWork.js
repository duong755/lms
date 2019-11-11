const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "exam_work" (
//     "id" timeuuid,
//     "exam_id" timeuuid,
//     "student_id" uuid,
//     "content" set<frozen<quiz>>,
//     PRIMARY KEY (("exam_id"), "id")
// );
module.exports = mapper(['exam_work'], 'ExamWork').forModel('ExamWork');
