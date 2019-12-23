module.exports = {
  auth: require('./auth'),
  canAccessCourse: require('./canAccessCourse'),
  canAccessJoinRequest: require('./canAccessJoinRequest'),
  isCommentCreator: require('./isCommentCreator'),
  isCourseCreator: require('./isCourseCreator'),
  isCourseMember: require('./isCourseCreator'),
  canAccessExamWork: require('./canAccessExamWork'),
  canAccessExerciseWork: require('./canAccessExerciseWork'),
  isReviewCreator: require('./isReviewCreator'),
  validateEmail: require('./validateEmail'),
  validateUsername: require('./validateUsername'),
  isAuthenticated: require('./isAuthenticated')
};
