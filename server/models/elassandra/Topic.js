const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "topic" (
//     "name" text,
//     PRIMARY KEY ("name")
// );
module.exports = mapper(['topic'], 'Topic').forModel('Topic');
