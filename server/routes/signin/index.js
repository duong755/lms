const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { UserServices } = require('../../services');

const signinRouter = Router({ mergeParams: true });

signinRouter.post('/*', async (req, res) => {
  if (req.isUnauthenticated()) {
    const emailOrUsername = req.body.email || req.body.username;
    try {
      const apires = await UserServices.getUserByEmailOrUsername(emailOrUsername);
      if (apires.body.hits.total) {
        const user = apires.body.hits.hits[0]._source;
        bcrypt.compare(req.body.password, user.hash_password, (err, same) => {
          if (err) {
            console.log(err);
            res.status(400).json({
              error: 'Wrong username/email or password'
            });
          } else {
            if (same) {
              delete user.hash_password;
              const token = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

              req.cookies['access_token'] = token;

              res.locals.user = user;
              res
                .status(200)
                .json({ successful: true, user: user })
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
        error: err.message
      });
    }
  }
  res.end({
    warning: 'You have already authenticated'
  });
});

module.exports = signinRouter;
