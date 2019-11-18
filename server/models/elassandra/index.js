module.exports = {
  cassandraClient: require('./connector').cassandraClient,
  elasticsearchClient: require('./connector').elasticsearchClient,
  cassandraTypes: require('./connector').cassandraTypes,
  mapperCreator: require('./connector').mapper,

  User: require('./User'),
  Course: require('./Course'),
  Topic: require('./Topic'),
  Member: require('./Member'),
  JoinRequest: require('./JoinRequest'),
  Review: require('./Review'),
  Lesson: require('./Lesson'),
  Comment: require('./Comment'),
  Exercise: require('./Exercise'),
  ExerciseWork: require('./ExerciseWork'),
  Exam: require('./Exam'),
  ExamWork: require('./ExamWork')
};
