const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "join_request" (
//     "student_id" uuid,
//     "course_id" uuid,
//     "teacher_id" uuid,
//     "request_at" timestamp,
//     PRIMARY KEY (("teacher_id", "course_id"), "student_id")
// );
module.exports = mapper(['join_request'], 'JoinRequest').forModel('JoinRequest');
