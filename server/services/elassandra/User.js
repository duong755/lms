const cryto = require('crypto');

const User = require('../../models/elassandra/User');
const { cassandraClient } = require('../../models/elassandra/connector');

const GRAVATAR_URL = 'https://gravatar.com/avatar';

function getUserByEmail() {}

/**
 * @param {object} user
 * @param {string} user.userId
 * @param {string} user.email
 * @param {string} user.hashPassword
 * @param {object} user.info
 * @param {string} user.username
 * @param {'student' | 'teacher'} user.type
 * @param {string} user.userId
 */
function createUser(user) {
  const md5Email = cryto
    .createHash('md5')
    .update(String(user.email))
    .digest('hex');

  return User.insert({
    username: user.username,
    hashPassword: user.hashPassword,
    info: {
      fullName: '',
      birthday: '',
      image: `${GRAVATAR_URL}/${md5Email}`
    },
    email: user.email,
    type: user.type,
    id: user.userId
  });
}

/**
 *
 * @param {string} userId
 * @param {string} newPassword
 */
function updateUserPassword(userId, newPassword) {
  return User.update({ id: userId, hashPassword: newPassword }, { ifExists: true });
}

/**
 *
 * @param {string} userId
 * @param {object} info
 */
function updateUserInfo(userId, newInfo) {
  if (typeof newInfo !== 'object') {
    newInfo = {};
  }

  delete newInfo.image;
  newInfo._random_ = Math.random();

  const queries = Object.keys(newInfo).map((currentKey) => {
    switch (newInfo[currentKey]) {
      case void 0:
      case '':
        return {
          query: 'DELETE info[?] FROM user WHERE id = ? IF EXISTS',
          params: [currentKey, userId]
        };
      default:
        return {
          query: `UPDATE user SET info[?] = ? WHERE id = ${userId} IF EXISTS`,
          params: [currentKey, newInfo[currentKey]]
        };
    }
  });
  return cassandraClient.batch(queries, { prepare: true });
}

/**
 *
 * @param {string} userId
 * @param {string} newUsername
 */
function updateUserName(userId, newUserName) {
  return User.update({ id: userId, username: newUserName }, { ifExists: true });
}

/**
 *
 * @param {string} userId
 * @param {string} newEmail
 */
function updateEmail(userId, newEmail) {
  return User.update({ id: userId, email: newEmail }, { ifExists: true });
}

module.exports = {
  getUserByEmail,
  createUser,
  updateUserPassword,
  updateUserInfo,
  updateEmail,
  updateUserName
};
