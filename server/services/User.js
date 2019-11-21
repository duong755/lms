const cryto = require('crypto');

const _ = require('lodash');

const { User, cassandraClient, elasticsearchClient } = require('../models');

const GRAVATAR_URL = 'https://gravatar.com/avatar';

/**
 *
 * @param {string} userId
 */
function getUserById(userId) {
  return elasticsearchClient.get({
    index: 'lms.user',
    type: 'user',
    id: userId
  });
}

/**
 *
 * @param {string | string[]} userId
 */
function getMultipleUsersById(userId) {
  if (!(userId instanceof Array)) {
    userId = [userId];
  }

  return elasticsearchClient.search({
    index: 'lms.user',
    type: 'user',
    body: {
      query: {
        ids: {
          type: 'user',
          values: userId
        }
      }
    }
  });
}

/**
 *
 * @param {string} username
 */
function getUserByUsername(username) {
  return elasticsearchClient.search({
    index: 'lms.user',
    type: 'user',
    size: 1,
    body: {
      query: {
        match: {
          username: username
        }
      }
    }
  });
}

/**
 *
 * @param {string} email
 */
function getUserByEmail(email) {
  return elasticsearchClient.search({
    index: 'lms.user',
    type: 'user',
    size: 1,
    body: {
      query: {
        match: {
          email: email
        }
      }
    }
  });
}

/**
 * @param {object} user
 * @param {import('cassandra-driver').types.Uuid} user.userId
 * @param {string} user.email
 * @param {string} user.hashPassword
 * @param {object} user.info
 * @param {string} user.username
 * @param {'student' | 'teacher'} user.type
 * @param {string} user.userId
 * @param {number} [ttl]
 */
function createUser(user, ttl) {
  const md5Email = cryto
    .createHash('md5')
    .update(String(user.email))
    .digest('hex');

  return User.insert(
    {
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
    },
    {
      ifNotExists: true,
      ttl: ttl
    }
  );
}

/**
 *
 * @param {import('cassandra-driver').types.Uuid} userId
 * @param {string} newPassword
 * @param {number} [ttl]
 */
function updateUserPassword(userId, newPassword, ttl) {
  return User.update({ id: userId, hashPassword: newPassword }, { ifExists: true, ttl: ttl });
}

/**
 *
 * @param {import('cassandra-driver').types.Uuid} userId
 * @param {Object<string, string>} newInfo
 * @param {number} [ttl]
 */
function updateUserInfo(userId, newInfo, ttl) {
  if (typeof newInfo !== 'object') {
    newInfo = {};
  }

  delete newInfo.image;
  newInfo._update_ = Math.random();
  newInfo._delete_ = void 0;

  // convert values to string
  newInfo = _.mapValues(newInfo, (value) => {
    switch (value) {
      case void 0:
      case '':
      case null:
        return value;
      default:
        return String(value);
    }
  });

  const pairs = _.toPairs(newInfo);
  const twoGroups = _.groupBy(pairs, (pair) => {
    switch (pair[1]) {
      case void 0:
      case '':
      case null:
        return 'delete';
      default:
        return 'update';
    }
  });

  const deleteKeys = twoGroups.delete.map((currentPair) => currentPair[0]);
  const deleteQuery = `DELETE ${deleteKeys.map(() => 'info[?]').join(', ')} FROM user WHERE id = ? IF EXISTS`;

  const timeToLive = typeof ttl === 'number' ? `USING TTL ${ttl}` : '';
  const updateKeys = twoGroups.update.map((currentPair) => currentPair[0]);
  const updateQuery = `UPDATE user ${timeToLive} SET ${updateKeys
    .map(() => 'info[?] = ?')
    .join(', ')} WHERE id = ? IF EXISTS`;

  const queries = [
    {
      query: updateQuery,
      params: [..._.flatten(twoGroups.update), userId]
    },
    {
      query: deleteQuery,
      params: [...deleteKeys, userId]
    }
  ];

  return cassandraClient.batch(queries, { prepare: true });
}

/**
 *
 * @param {import('cassandra-driver').types.Uuid} userId
 * @param {string} newUsername
 * @param {number} [ttl]
 */
function updateUserName(userId, newUserName, ttl) {
  return User.update({ id: userId, username: newUserName }, { ifExists: true, ttl: ttl });
}

/**
 *
 * @param {import('cassandra-driver').types.Uuid} userId
 * @param {string} newEmail
 * @param {number} [ttl]
 */
function updateEmail(userId, newEmail, ttl) {
  const md5Email = cryto
    .createHash('md5')
    .update(String(newEmail))
    .digest('hex');
  const timeToLive = typeof ttl === 'number' ? `USING TTL ${ttl}` : '';
  const query = `UPDATE user ${timeToLive} SET email = ?, info[?] = ? WHERE id = ?`;

  return cassandraClient.execute(query, [newEmail, 'image', `${GRAVATAR_URL}/${md5Email}`, userId], { prepare: true });
}

module.exports = {
  getUserById: getUserById,
  getMultipleUsersById: getMultipleUsersById,
  getUserByUsername: getUserByUsername,
  getUserByEmail: getUserByEmail,
  createUser: createUser,
  updateUserPassword: updateUserPassword,
  updateUserInfo: updateUserInfo,
  updateEmail: updateEmail,
  updateUserName: updateUserName
};
