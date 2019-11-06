const { mapper } = require('./connector');

module.exports = mapper(['course'], 'Course').forModel('Course');
