const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "exam" (
//     "id" timeuuid,
//     "course_id" uuid,
//     "title" text,
//     "start_at" timestamp,
//     "duration" text,
//     "content" set<frozen<quiz>>,
//     PRIMARY KEY (("course_id"), "id")
// ) WITH CLUSTERING ORDER BY ("id" DESC);
module.exports = mapper(['exam'], 'Exam').forModel('Exam');
