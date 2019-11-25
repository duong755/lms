/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * @type {RequestHandler}
 */
const canAccessCourse = (req, res, next) => {
  next();
};

module.exports = canAccessCourse;
