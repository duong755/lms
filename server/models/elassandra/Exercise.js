const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "exercise" (
//     "id" timeuuid,
//     "course_id" uuid,
//     "teacher_id" uuid,
//     "title" text,
//     "deadline" timestamp,
//     "content" text,
//     PRIMARY KEY (("course_id", "teacher_id"), "id")
// ) WITH CLUSTERING ORDER BY ("id" DESC);
module.exports = mapper(['exercise'], 'Exercise').forModel('Exercise');
