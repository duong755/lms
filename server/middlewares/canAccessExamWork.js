/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * @type {RequestHandler}
 */
const canAccessExamWork = (req, res, next) => {
  next();
};

module.exports = canAccessExamWork;
