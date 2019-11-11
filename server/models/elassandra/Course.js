const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "course" (
//     "id" uuid,
//     "teacher_id" uuid,
//     "teacher_name" text,
//     "course_name" text,
//     "created_at" timestamp,
//     "description" text,
//     "archive" boolean,
//     "topics" set<text>,
//     "members" set<uuid>,
//     PRIMARY KEY (("teacher_id"), "id")
// );
module.exports = mapper(['course'], 'Course').forModel('Course');
