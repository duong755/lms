const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "comment" (
//     "id" timeuuid,
//     "lesson_id" timeuuid,
//     "user_id" uuid,
//     "content" text,
//     PRIMARY KEY (("lesson_id"), "id")
// ) WITH CLUSTERING ORDER BY ("id" DESC);
module.exports = mapper(['comment'], 'Comment').forModel('Comment');
