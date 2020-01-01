const mapper = require('./mapper');

// CREATE TABLE IF NOT EXISTS "join_request" (
//     "student_id" uuid,
//     "course_id" uuid,
//     "teacher_id" uuid,
//     "request_at" timestamp,
//     PRIMARY KEY (("teacher_id", "course_id"), "student_id")
// );
module.exports = mapper.forModel('join_request');
