/**
 * @typedef {import('express').RequestHandler} RequestHandler
 * @typedef {import('express').Request} Request
 */
const passport = require('passport');
const passportJwt = require('passport-jwt');

/**
 *
 * @param {Request} req
 */
const cookieExtractor = (req) => {
  let token = null;
  if (req.cookies['access_token']) {
    token = req.cookies['access_token'];
  }
  return token;
};
const authHeaderExtractor = passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken;

const strategy = new passportJwt.Strategy(
  {
    secretOrKey: process.env.JWT_SECRET_KEY,
    jwtFromRequest: passportJwt.ExtractJwt.fromExtractors([cookieExtractor, authHeaderExtractor])
  },
  (payload, done) => {
    done(null, {});
  }
);

passport.use('jwt', strategy);

/**
 * @type {RequestHandler}
 */
const auth = (req, res, next) => {
  passport.authenticate('jwt', () => {
    next();
  })(req, res, next);
};

module.exports = auth;
