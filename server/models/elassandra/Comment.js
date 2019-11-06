const { mapper } = require('./connector');

module.exports = mapper(['comment'], 'Comment').forModel('Comment');
