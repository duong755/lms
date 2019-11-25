/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * @type {RequestHandler}
 */
const auth = (req, res, next) => {
  next();
};

module.exports = auth;
