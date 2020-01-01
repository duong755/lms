const mapper = require('./mapper');

// CREATE TABLE IF NOT EXISTS "comment" (
//     "id" timeuuid,
//     "lesson_id" timeuuid,
//     "course_id" uuid,
//     "teacher_id" uuid,
//     "user_id" uuid,
//     "content" text,
//   PRIMARY KEY (("teacher_id", "course_id", "lesson_id"), "id")
// ) WITH CLUSTERING ORDER BY ("id" DESC);
module.exports = mapper.forModel('comment');
