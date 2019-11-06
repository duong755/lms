const { mapper } = require('./connector');

module.exports = mapper(['course_join_request'], 'JoinRequest').forModel('JoinRequest');
