const { mapper } = require('./connector');

module.exports = mapper(['user'], 'User').forModel('User');
