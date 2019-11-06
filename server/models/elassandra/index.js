module.exports = {
  cassandraClient: require('./connector').cassandraClient,
  // elasticsearchClient: require('./connector').elasticsearchClient,

  User: require('./User'),
  Course: require('./Course'),
  Topic: require('./Topic'),
  CourseMember: require('./CourseMember'),
  JoinRequest: require('./JoinRequest'),
  Review: require('./Review'),
  Lesson: require('./Lesson'),
  Comment: require('./Comment'),
  Exercise: require('./Exercise'),
  ExerciseWork: require('./ExerciseWork'),
  Exam: require('./Exam'),
  ExamWork: require('./ExamWork')
};
