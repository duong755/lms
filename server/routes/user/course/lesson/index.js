const { Router } = require('express');

const commentRouter = require('./comment');

const auth = require('../../../../middlewares/auth');
const isCourseCreator = require('../../../../middlewares/isCourseCreator');
const { cassandraTypes } = require('../../../../models/connector');
const lessonService = require('../../../../services/Lesson');

const lessonRouter = Router({ mergeParams: true });

/**
 * lesson pagination
 */
lessonRouter.get('/', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson');
});

/**
 * create lesson
 */
lessonRouter.post('/', auth, isCourseCreator, async (req, res) => {
  const user = res.locals.user;
  const newLesson = {
    teacherId: user.id,
    courseId: req.params.courseId,
    id: cassandraTypes.TimeUuid.now(),
    title: req.body.title,
    content: req.body.content
  };
  try {
    const upsertResult = await lessonService.upsertLesson(newLesson, void 0, true);
    if (upsertResult.wasApplied()) {
      res.status(200).json({ success: 'Create new lesson successfully' });
    } else {
      res.status(500).json({ error: 'Unexpected error occured' });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/**
 * get lesson data
 */
lessonRouter.get('/:lessonId', (req, res) => {
  res.end('/api/user/:userId/course/:courseId/lesson/:lessonId');
});

/**
 * edit lesson
 */
lessonRouter.put('/:lessonId', auth, isCourseCreator, async (req, res) => {
  const user = res.locals.user;
  try {
    let lesson = await lessonService.getLessonById(user.id, req.params.courseId, req.params.lessonId);
    lesson = lesson.body._source;
    const newLesson = {
      teacherId: user.id,
      courseId: req.params.courseId,
      id: req.params.lessonId,
      content: req.body.content === undefined ? lesson.content : req.body.content,
      title: req.body.title === undefined ? lesson.title : req.body.title
    };
    const updateResult = await lessonService.upsertLesson(
      newLesson,
      ['teacher_id', 'course_id', 'id', 'title', 'content'],
      false
    );
    if (updateResult.wasApplied()) {
      res.status(200).json({
        Success: 'Update lesson successfully'
      });
    } else {
      res.status(500).json({ error: 'Unexpected error occured' });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/**
 * delete lesson
 */
lessonRouter.delete('/:lessonId', auth, isCourseCreator, async (req, res) => {
  try {
    const deleteResult = await lessonService.removeLesson(req.params.userId, req.params.courseId, req.params.lessonId);
    if (deleteResult.wasApplied()) {
      res.status(200).json({ success: 'Delete lesson successfully' });
    } else {
      res.status(500).json({ error: 'Unexpected error occured' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

lessonRouter.use('/:lessonId/comment', commentRouter);

module.exports = lessonRouter;
