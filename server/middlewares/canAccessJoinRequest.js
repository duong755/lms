/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * @type {RequestHandler}
 */
const canAccessJoinRequest = (req, res, next) => {
  next();
};

module.exports = canAccessJoinRequest;
