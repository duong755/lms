const { mapper } = require('./connector');

module.exports = mapper(['exam'], 'Exam').forModel('Exam');
