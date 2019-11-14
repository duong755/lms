const cryto = require('crypto');

const _ = require('lodash');

const User = require('../../models/elassandra/User');
const Commment = require('../../models/elassandra/Comment');
const JoinRequest = require('../../models/elassandra/JoinRequest');
const { cassandraClient, cassandraTypes } = require('../../models/elassandra/connector');

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
 * @param {Object<string, string>} newInfo
 */
function updateUserInfo(userId, newInfo) {
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

  const userUUID = cassandraTypes.Uuid.fromString(userId).toString();

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
  const deleteQuery = `DELETE ${deleteKeys.map(() => 'info[?]').join(', ')} FROM user WHERE id = ${userUUID} IF EXISTS`;

  const updateKeys = twoGroups.update.map((currentPair) => currentPair[0]);
  const updateQuery = `UPDATE user SET ${updateKeys
    .map(() => 'info[?] = ?')
    .join(', ')} WHERE id = ${userUUID} IF EXISTS`;

  const queries = [
    {
      query: updateQuery,
      params: [..._.flatten(twoGroups.update)]
    },
    {
      query: deleteQuery,
      params: [...deleteKeys]
    }
  ];

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
  const md5Email = cryto
    .createHash('md5')
    .update(String(newEmail))
    .digest('hex');
  const query = 'UPDATE user SET email = ?, info[?] = ? WHERE id = ?';

  return cassandraClient.execute(query, [newEmail, 'image', `${GRAVATAR_URL}/${md5Email}`, userId], { prepare: true });
}
/**
 *
 * @param {object} comment
 * @param {string} comment.lessonId
 * @param {string} comment.content
 * @param {string} comment.userId
 * @param {string} comment.id
 */
function createComment(comment) {
  return Commment.insert(
    {
      lessonId: comment.lessonId,
      id: comment.id,
      content: comment.content,
      userId: comment.userId
    },
    {
      ifNotExists: true
    }
  );
}

/**
 *
 * @param {string} id
 * @param {string} lessonId
 * @param {string} newContent
 */
function editComment(id, lessonId, newContent) {
  return Commment.update(
    { id: id, lessonId: lessonId, content: newContent },
    {
      ifExists: true
    }
  );
}
/**
 * @param {string} id
 * @param {string} lessonId
 */
function deleteComment(id, lessonId) {
  return Commment.remove({ id: id, lessonId: lessonId }, { ifExists: true });
}

/**
 *
 * @param {string} courseId
 * @param {string} teacherId
 * @param {string} studentId
 */
function cancelJoinRequest(courseId, teacherId, studentId) {
  return JoinRequest.remove({
    courseId: courseId,
    teacherId: teacherId,
    studentId: studentId
  });
}

module.exports = {
  getUserByEmail,
  createUser,
  updateUserPassword,
  updateUserInfo,
  updateEmail,
  updateUserName,
  createComment,
  editComment,
  deleteComment,
  cancelJoinRequest
};
