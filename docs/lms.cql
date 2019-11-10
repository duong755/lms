DROP KEYSPACE IF EXISTS "lms";
CREATE KEYSPACE IF NOT EXISTS "lms"
WITH replication = {'class': 'NetworkTopologyStrategy', 'DC1' : 1};

USE "lms";

CREATE TYPE IF NOT EXISTS "quiz" (
   "id" uuid,
   "question" text,
   "choices" set<text>,
   "answer" tinyint,
   "point" tinyint
);

CREATE TABLE IF NOT EXISTS "user" (
   "id" uuid,
   "username" text,
   "email" text,
   "hash_password" text,
   "type" text,
   "info" map<text, text>,
   PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "topic" (
   "name" text,
   PRIMARY KEY ("name")
);

CREATE TABLE IF NOT EXISTS "course" (
  "id" uuid,
  "teacher_id" uuid,
  "teacher_name" text,
  "course_name" text,
  "created_at" timestamp,
  "description" text,
  "archive" boolean,
  "topics" set<text>,
  "members" set<uuid>,
  PRIMARY KEY (("teacher_id"), "id")
);


CREATE TABLE IF NOT EXISTS "review" (
   "course_id" uuid,
   "teacher_id" uuid,
   "student_id" uuid,
   "star" tinyint,
   "content" text,
   "created_at" timestamp,
   PRIMARY KEY (("course_id", "teacher_id"), "student_id")
);

CREATE TABLE IF NOT EXISTS "join_request" (
	"student_id" uuid,
	"course_id" uuid,
	"teacher_id" uuid,
	"request_at" timestamp,
	PRIMARY KEY (("course_id", "teacher_id"), "student_id")
);

CREATE TABLE IF NOT EXISTS "member" (
	"student_id" uuid,
	"course_id" uuid,
	"teacher_id" uuid,
	"joined_at" timestamp,
	PRIMARY KEY (("course_id", "teacher_id"), "student_id")
);

CREATE TABLE IF NOT EXISTS "lesson" (
   "id" timeuuid,
   "course_id" uuid,
   "teacher_id" uuid,
   "title" text,
   "content" text,
   PRIMARY KEY (("course_id", "teacher_id"), "id")
) WITH CLUSTERING ORDER BY ("id" DESC);

CREATE TABLE IF NOT EXISTS "comment" (
   "id" timeuuid,
   "lesson_id" timeuuid,
   "user_id" uuid,
   "content" text,
   PRIMARY KEY (("lesson_id"), "id")
) WITH CLUSTERING ORDER BY ("id" DESC);

CREATE TABLE IF NOT EXISTS "exercise" (
   "id" timeuuid,
   "course_id" uuid,
   "teacher_id" uuid,
   "title" text,
   "deadline" timestamp,
   "content" text,
   PRIMARY KEY (("course_id", "teacher_id"), "id")
) WITH CLUSTERING ORDER BY ("id" DESC);

CREATE TABLE IF NOT EXISTS "exercise_work" (
   "id" timeuuid,
   "exercise_id" timeuuid,
   "student_id" uuid,
   "content" text,
   "points" float,
   PRIMARY KEY (("exercise_id"), "id")
);

CREATE TABLE IF NOT EXISTS "exam" (
   "id" timeuuid,
   "course_id" uuid,
   "title" text,
   "start_at" timestamp,
   "duration" text,
   "content" set<frozen<quiz>>,
   PRIMARY KEY (("course_id"), "id")
) WITH CLUSTERING ORDER BY ("id" DESC);

CREATE TABLE IF NOT EXISTS "exam_work" (
   "id" timeuuid,
   "exam_id" timeuuid,
   "student_id" uuid,
   "content" set<frozen<quiz>>,
   PRIMARY KEY (("exam_id"), "id")
);
