const crypto = require('crypto');

const { User } = require('../../models/elassandra');

const GRAVATAR_URL = 'https://gravatar.com/avatar';
/**
 *
 * @param {string} username
 */
function getUserByUsername(username) {
  return User.get({
    username: username
  });
}

/**
 *
 * @param {object} user
 * @param {string} user.username
 * @param {string} user.email
 * @param {string} user.hashPassword
 * @param {'teacher' | 'student'} user.type
 * @param {number} user.createAt
 * @param {object} [user.info]
 */
function createUser(user) {
  const md5email = crypto
    .createHash('md5')
    .update(String(user.email))
    .digest('hex');

  return User.insert({
    username: user.username,
    email: user.email,
    hashPassword: user.hashPassword,
    type: user.type,
    createAt: user.createAt,
    info: {
      fullname: '',
      birthday: '',
      ...user.info,
      image: `${GRAVATAR_URL}/${md5email}`
    }
  });
}

/**
 *
 * @param {string} username
 * @param {object} info
 * @param {string} [info.fullname]
 * @param {string} [info.birthday]
 */
function updateUserInfo(username, info) {
  if (typeof info === 'object') {
    delete info.image;
  }
  return User.update({ username: username, info: info }, { ifExists: true });
}

/**
 *
 * @param {string} username
 * @param {string} newHashPassword
 */
function updateUserPassword(username, newHashPassword) {
  return User.update({ username: username, hashPassword: newHashPassword }, { ifExists: false });
}

module.exports = {
  getUserByUsername: getUserByUsername,
  createUser: createUser,
  updateUserPassword: updateUserPassword,
  updateUserInfo: updateUserInfo
};
