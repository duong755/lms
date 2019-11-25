/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * @type {RequestHandler}
 */
const isCommentCreator = (req, res, next) => {
  next();
};

module.exports = isCommentCreator;
