const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "member" (
// 	"student_id" uuid,
// 	"course_id" uuid,
// 	"teacher_id" uuid,
// 	"joined_at" timestamp,
// 	PRIMARY KEY (("course_id", "teacher_id"), "student_id")
// );
module.exports = mapper(['member'], 'CourseMember').forModel('CourseMember');
