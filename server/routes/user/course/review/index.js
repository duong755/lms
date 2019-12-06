const { Router } = require('express');

const reviewService = require('../../../../services/Review');
const reviewRouter = Router({ mergeParams: true });

/**
 * review pagination
 */
reviewRouter.get('/', async (req, res) => {
  const page = req.query.page || 1;
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  try {
    const resultGet = await reviewService.getReviews(teacherId, courseId, page);
    const reviews = resultGet.body.hits.hits.map((current) => current._source);
    const total = resultGet.body.hits.total;
    res.status(200).json({ reviews: reviews, total: total });
  } catch (error) {
    res.status(500).json({ error: error });
  }
  // res.end('/api/user/:userId/course/:courseId/review');
});

/**
 * create review
 */
reviewRouter.post('/', async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const studentId = res.locals.user.id;
  const content = req.body.content;
  const star = req.body.star;
  console.log(req.body);
  console.log(req.params);
  try {
    const newReview = {
      teacherId: teacherId,
      courseId: courseId,
      studentId: studentId,
      content: content,
      star: star
    };
    console.log(newReview);
    const result = await reviewService.upsertReview(newReview, void 0, true);
    if (result.wasApplied()) {
      res.status(200).json({ success: 'Create new revirew successfully' });
    } else {
      res.status(400).json({ error: 'Can not create new review' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
  // res.end('/api/user/:userId/course/:courseId/review');
});

/**
 * edit review
 */
reviewRouter.put('/:studentId', async (req, res) => {
  const content = req.body.content;
  const star = req.body.start;
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;
  try {
    const newReview = {
      teacherId: teacherId,
      courseId: courseId,
      studentId: studentId,
      content: content,
      star: star
    };
    const result = await reviewService.upsertReview(
      newReview,
      ['teacher_id', 'course_id', 'student_id', 'content', 'star'],
      false
    );
    if (result.wasApplied()) {
      res.status(200).json({ success: 'Update review successfully' });
    } else {
      res.status(400).json({ error: 'Can not update this review' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
  // res.end('/api/user/:userId/course/:courseId/review/:studentId');
});

reviewRouter.delete('/:studentId', async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;
  try {
    const result = await reviewService.deleteReview(teacherId, courseId, studentId);
    if (result.wasApplied()) {
      res.status(200).json({ success: 'Delete review successfully' });
    } else {
      res.status(400).json({ error: 'Can not delete this review' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
  res.end('/api/user/:userId/course/:courseId/review/:studentId');
});

module.exports = reviewRouter;
