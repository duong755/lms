/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * @type {RequestHandler}
 */
const isCourseMember = (req, res, next) => {
  next();
};

module.exports = isCourseMember;
