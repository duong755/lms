/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * @type {RequestHandler}
 */
const isCourseCreator = (req, res, next) => {
  next();
};

module.exports = isCourseCreator;
