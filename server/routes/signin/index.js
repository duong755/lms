const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const { UserServices } = require('../../services');

const signinRouter = Router({ mergeParams: true });

signinRouter.post('/*', async (req, res) => {
  if (req.isUnauthenticated()) {
    const emailOrUsername = req.body.emailOrUsername || req.body.email || req.body.username || '';
    try {
      const apires = await UserServices.getUserByEmailOrUsername(emailOrUsername);
      if (apires.body.hits.total) {
        const user = apires.body.hits.hits[0]._source;
        bcrypt.compare(req.body.password, user.hash_password, (err, same) => {
          if (err) {
            res.status(400).json({
              error: 'Wrong username/email or password'
            });
          } else {
            if (same) {
              delete user.hash_password;
              const token = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

              const expiresAt = dayjs()
                .add(7, 'd')
                .toDate();
              res.cookie('access_token', token, {
                path: '/',
                sameSite: true,
                expires: expiresAt,
                httpOnly: true
              });

              res.locals.user = user;
              res
                .status(200)
                .json({ successful: true, token: token, user: user })
                .end();
            } else {
              res.status(400).json({
                error: 'Wrong username/email or password'
              });
            }
          }
        });
      } else {
        throw new Error('Wrong username or password');
      }
    } catch (err) {
      res.status(400).json({
        error: err.message.replace(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?)/g, '')
      });
    }
  } else {
    res.status(200).json({
      success: true,
      warning: 'You have already been authenticated'
    });
  }
});

module.exports = signinRouter;
