const mapper = require('./mapper');

// CREATE TABLE IF NOT EXISTS "exam" (
//     "id" timeuuid,
//     "course_id" uuid,
//     "teacher_id" uuid,
//     "title" text,
//     "start_at" timestamp,
//     "duration" text,
//     "content" set<frozen<quiz>>,
//     PRIMARY KEY (("teacher_id", "course_id"), "id")
// ) WITH CLUSTERING ORDER BY ("id" DESC);
module.exports = mapper.forModel('exam');
