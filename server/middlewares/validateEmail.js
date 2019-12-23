/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */
const Joi = require('@hapi/joi');

const { UserServices } = require('../services');

/**
 * @type {RequestHandler}
 */
const isEmailValid = async (req, res, next) => {
  const emailValidationSchema = Joi.string()
    .email()
    .required();
  const validationResult = emailValidationSchema.validate(req.body.email);
  if (validationResult.error) {
    res.status(400).json({ error: 'Email is invalid' });
  } else {
    next();
  }
};

/**
 * @type {RequestHandler}
 */
const isEmailUnique = async (req, res, next) => {
  try {
    const userRes = await UserServices.getUserByEmail(req.body.email);
    if (userRes.body.hits.total > 0) {
      res.status(400).json({ error: `Email ${req.body.email} has already been used` });
    } else {
      next();
    }
  } catch (emailErr) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

module.exports = {
  isEmailUnique: isEmailUnique,
  isEmailValid: isEmailValid
};
