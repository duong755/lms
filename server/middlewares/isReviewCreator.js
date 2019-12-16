/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * @type {RequestHandler}
 */
const isReviewCreator = (req, res, next) => {
  next();
};

module.exports = isReviewCreator;
