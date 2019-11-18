const mapper = require('./mapper');

// CREATE TABLE IF NOT EXISTS "lesson" (
//     "id" timeuuid,
//     "course_id" uuid,
//     "teacher_id" uuid,
//     "title" text,
//     "content" text,
//     PRIMARY KEY (("teacher_id", "course_id"), "id")
// ) WITH CLUSTERING ORDER BY ("id" DESC);
module.exports = mapper.forModel('lesson');
