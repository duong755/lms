const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "review" (
//     "course_id" uuid,
//     "teacher_id" uuid,
//     "student_id" uuid,
//     "star" tinyint,
//     "content" text,
//     "created_at" timestamp,
//     PRIMARY KEY (("teacher_id", "course_id"), "student_id")
// );
module.exports = mapper(['review'], 'Review').forModel('Review');
