const mapper = require('./mapper');

// CREATE TABLE IF NOT EXISTS "topic" (
//     "name" text,
//     PRIMARY KEY ("name")
// );
module.exports = mapper.forModel('topic');
