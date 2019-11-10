const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "join_request" (
// 	"student_id" uuid,
// 	"course_id" uuid,
// 	"teacher_id" uuid,
// 	"request_at" timestamp,
// 	PRIMARY KEY (("course_id", "teacher_id"), "student_id")
// );
module.exports = mapper(['course_join_request'], 'JoinRequest').forModel('JoinRequest');
