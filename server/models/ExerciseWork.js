const mapper = require('./mapper');

// CREATE TABLE IF NOT EXISTS "exercise_work" (
//     "course_id" uuid,
//     "teacher_id" uuid,
//     "exercise_id" timeuuid,
//     "student_id" uuid,
//     "submit_at" timeuuid,
//     "content" text,
//     "point" float,
//     PRIMARY KEY (("teacher_id", "course_id", "exercise_id"), "student_id")
// );
module.exports = mapper.forModel('exercise_work');
