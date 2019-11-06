const { mapper } = require('./connector');

module.exports = mapper(['exercise'], 'Exercise').forModel('Exercise');
