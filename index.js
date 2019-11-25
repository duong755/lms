const { Router } = require('express');

/**
 * /user/:userId
 * /user/:userId/course
 * /user/:userId/course/:courseId
 * /user/:userId/course/:courseId/lesson
 * /user/:userId/course/:courseId/lesson/:lessonId
 * /user/:userId/course/:courseId/lesson/:lessonId/comment
 * /user/:userId/course/:courseId/lesson/:lessonId/comment/:commentId
 * /user/:userId/course/:courseId/review
 * /user/:userId/course/:courseId/review/:studentId
 * /user/:userId/course/:courseId/join_request
 * /user/:userId/course/:courseId/join_request/:studentId
 * /user/:userId/course/:courseId/exercise
 * /user/:userId/course/:courseId/exercise/:exerciseId
 * /user/:userId/course/:courseId/exercise/:exerciseId/:studentId
 * /user/:userId/course/:courseId/exercise/:exerciseId/summary
 * /user/:userId/course/:courseId/exam
 * /user/:userId/course/:courseId/exam/:examId
 * /user/:userId/course/:courseId/exam/:examId/:studentId
 * /user/:userId/course/:courseId/exam/:examId/summary
 * /search
 * /auth
 * /topic
 * /signup
 * /signin
 */

const examRouter = Router({ mergeParams: true });
examRouter.all('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exam');
});
examRouter.all('/:examId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exam/:examId');
});
examRouter.all('/:examId/summary', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exam/:examId/summary');
});
examRouter.all('/:examId/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exam/:examId/:studentId');
});

const exerciseRouter = Router({ mergeParams: true });
exerciseRouter.all('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exercise');
});
exerciseRouter.all('/:exerciseId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId');
});
exerciseRouter.all('/:exerciseId/summary', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId/summary');
});
exerciseRouter.all('/:exerciseId/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/exercise/:exerciseId/:studentId');
});

const reviewRouter = Router({ mergeParams: true });
reviewRouter.all('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/review');
});
reviewRouter.all('/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/review/:studentId');
});

const commentRouter = Router({ mergeParams: true });
commentRouter.all('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson/:lessonId/comment');
});
commentRouter.all('/:commentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson/:lessonId/comment/:commentId');
});

const lessonRouter = Router({ mergeParams: true });
lessonRouter.all('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson');
});
lessonRouter.all('/:lessonId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson/:lessonId');
});
lessonRouter.use('/:lessonId/comment', commentRouter);

const joinRequestRouter = Router({ mergeParams: true });
joinRequestRouter.all('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/join_request');
});
joinRequestRouter.all('/:studentId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/join_request/:studentId');
});

const courseRouter = Router({ mergeParams: true });
courseRouter.all('/', (req, res) => {
  res.end('/api/user/:userId/course');
});
courseRouter.all('/:courseId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId');
});
courseRouter.use('/:courseId/lesson', lessonRouter);
courseRouter.use('/:courseId/review', reviewRouter);
courseRouter.use('/:courseId/exercise', exerciseRouter);
courseRouter.use('/:courseId/exam', examRouter);
courseRouter.use('/:courseId/join_request', joinRequestRouter);

const searchRouter = Router({ mergeParams: true });
searchRouter.all('/', (req, res) => {
  res.end('/api/search');
});

const topicRouter = Router({ mergeParams: true });
topicRouter.all('/', (req, res) => {
  res.end('/api/topic');
});

const authRouter = Router({ mergeParams: true });
authRouter.all('/', (req, res) => {
  res.end('/api/auth');
});

const signinRouter = Router({ mergeParams: true });
signinRouter.all('/', (req, res) => {
  res.end('/api/signin');
});

const signupRouter = Router({ mergeParams: true });
signupRouter.all('/', (req, res) => {
  res.end('/api/signup');
});

const userRouter = Router({ mergeParams: true });
userRouter.all('/', (req, res) => {
  res.end('/api/user');
});
userRouter.all('/:userId', (req, res) => {
  res.end('/api/user/:userId');
});
userRouter.use('/:userId/course', courseRouter);

const router = Router({ mergeParams: true });
router.all('/', (req, res) => {
  res.end('/api');
});
router.use('/user', userRouter);
router.use('/topic*', topicRouter);
router.use('/search*', searchRouter);
router.use('/auth', authRouter);
router.use('/signin', signinRouter);
router.use('/signup', signupRouter);

module.exports = router;
