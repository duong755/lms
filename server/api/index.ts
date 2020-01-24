import { Router } from 'express';

const rootRouter = Router({ mergeParams: true });

rootRouter.all('*', (req, res) => {
  res.status(200).json({
    succesful: true
  });
});

export default rootRouter;
