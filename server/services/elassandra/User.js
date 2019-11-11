require('dotenv').config();
const cryto = require('crypto');

const User = require('../../models/elassandra/User');
const { cassandraClient } = require('../../models/elassandra/connector');
const { cassandraTypes } = require('../../models/elassandra/connector');

const Uuid = cassandraTypes.Uuid;
const GRAVATAR_URL = 'https://gravatar.com/avatar';

function getUserByEmail() {}

/**
 * @param {String} user.userId
 * @param {String} user.email
 * @param {String} user.hashPassword
 * @param {Object} user.info
 * @param {String} user.username
 * @param {String} user.type
 * @param {Object} user
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
    id: Uuid.random()
  });
}

/**
 *
 * @param {String} userId
 * @param {String} newPassword
 */
function updateUserPassword(userId, newPassword) {
  return User.update({ id: userId, hashPassword: newPassword }, { ifExists: true });
}

/**
 *
 * @param {String} userId
 * @param {Object} info
 */
function updateUserInfo(userId, newInfo) {
  if (typeof newInfo === 'object') {
    delete newInfo.image;
  }
  const queries = Object.keys(newInfo).map((currentKey) => {
    switch (newInfo[currentKey]) {
      case void 0:
        break;
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
 * @param {String} userId
 * @param {String} newUsername
 */
function updateUserName(userId, newUsername) {
  return User.update({ id: userId, username: newUsername }, { ifExists: true });
}

/**
 *
 * @param {String} userId
 * @param {String} newEmail
 */
function updateEmail(userId, newEmail) {
  return User.update({ id: userId, email: newEmail }, { ifExists: true });
}

module.export = {
  getUserByEmail,
  createUser,
  updateUserPassword,
  updateUserInfo,
  updateEmail,
  updateUserName
};
