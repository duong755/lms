const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "exercise_work" (
//     "id" timeuuid,
//     "exercise_id" timeuuid,
//     "student_id" uuid,
//     "content" text,
//     "points" float,
//     PRIMARY KEY (("exercise_id"), "id")
// );
module.exports = mapper(['exercise_work'], 'ExerciseWork').forModel('ExerciseWork');
