/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

/**
 * @type {RequestHandler}
 */
const isExerciseWorkCreator = (req, res, next) => {
  next();
};

module.exports = isExerciseWorkCreator;
