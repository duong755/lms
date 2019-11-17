const { mapper } = require('./connector');

// CREATE TABLE IF NOT EXISTS "user" (
//     "id" uuid,
//     "username" text,
//     "email" text,
//     "hash_password" text,
//     "type" text,
//     "info" map<text, text>,
//     PRIMARY KEY ("id")
// );
module.exports = mapper(['user'], 'User').forModel('User');
