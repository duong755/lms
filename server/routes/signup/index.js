const { Router } = require('express');

const signupRouter = Router({ mergeParams: true });

signupRouter.post('/', (req, res) => {
  res.end('/api/signup');
});

module.exports = signupRouter;
