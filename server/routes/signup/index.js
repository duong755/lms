/**
 * @typedef {import('express').RequestHandler} RequestHandler
 */

const { Router } = require('express');
const { types } = require('cassandra-driver');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const { UserServices } = require('../../services');

const signupRouter = Router({ mergeParams: true });

const signUpSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string()
    .email({ allowUnicode: false })
    .required(),
  password: Joi.string().required(),
  type: Joi.string()
    .valid('teacher', 'student')
    .required()
});

/**
 * @type {RequestHandler}
 */
const validateBody = async (req, res, next) => {
  if (req.isUnauthenticated()) {
    const validationResults = signUpSchema.validate(req.body, {
      errors: {
        render: true,
        wrapArrays: true
      },
      abortEarly: false
    });
    if (validationResults.error && validationResults.error.details.length) {
      const parsedErrors = _.reduce(
        validationResults.error.details,
        (result, value) => {
          const path = value.path[0];
          const message = value.message;
          result[path] = message;
          return result;
        },
        {}
      );
      res.status(400).json({ error: parsedErrors });
      return;
    } else {
      next();
    }
  } else {
    res.status(400).json({
      warning: 'You have already been authenticated'
    });
  }
};

/**
 * @type {RequestHandler}
 */
const validateUniqueness = async (req, res, next) => {
  try {
    const resApis = await Promise.all([
      UserServices.getUserByUsername(req.body.username),
      UserServices.getUserByEmail(req.body.email)
    ]);

    const parsedErrors = {};
    if (resApis[0].body.hits.total) {
      parsedErrors['username'] = `Username "${req.body.username}" has already been used`;
    }
    if (resApis[1].body.hits.total) {
      parsedErrors['emai'] = `Email "${req.body.email}" has already been used`;
    }

    if (resApis.every((currentRes) => currentRes.body.hits.total === 0)) {
      next();
    } else {
      res.status(400).json({
        error: parsedErrors
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/**
 * @type {RequestHandler}
 */
const createUser = async (req, res, next) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      userId: types.Uuid.random(),
      username: req.body.username,
      email: req.body.email,
      hashPassword: hashPassword,
      type: req.body.type
    };
    res.locals.userId = user.userId;
    const createUserRes = await UserServices.createUser(user);
    if (createUserRes.wasApplied()) {
      next();
    } else {
      res.status(500).json({
        error: 'Unexpected error occured, please try again'
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/**
 * @type {RequestHandler}
 */
const signIn = async (req, res) => {
  const userId = res.locals.userId;
  try {
    const resApi = await UserServices.getUserById(String(userId));
    if (resApi.body.found) {
      const user = resApi.body._source;
      delete user.hash_password;
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

      const expiresAt = dayjs()
        .add(7, 'd')
        .toDate();
      res.cookie('access_token', token, {
        path: '/',
        sameSite: true,
        expires: expiresAt,
        httpOnly: true
      });
      res.cookie('lms.user', user, {
        path: '/',
        sameSite: true,
        expires: expiresAt
      });

      res
        .status(200)
        .json({ successful: true, token: token })
        .end();
    } else {
      res.status(500).json({
        error: 'Cannot signin'
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

signupRouter.post('/', validateBody, validateUniqueness, createUser, signIn);

module.exports = signupRouter;
