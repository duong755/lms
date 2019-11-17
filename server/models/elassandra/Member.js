const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "member" (
//     "student_id" uuid,
//     "course_id" uuid,
//     "teacher_id" uuid,
//     "joined_at" timestamp,
//     PRIMARY KEY (("teacher_id", "course_id"), "student_id")
// );
module.exports = mapper(['member'], 'Member').forModel('Member');
