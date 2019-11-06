const { mapper } = require('./connector');

module.exports = mapper(['course_review'], 'Review').forModel('Review');
