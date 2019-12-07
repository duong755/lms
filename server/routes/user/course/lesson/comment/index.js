const { Router } = require('express');

const { cassandraTypes } = require('../../../../../models/connector');
const commentService = require('../../../../../services/Comment');
const commentRouter = Router({ mergeParams: true });

/**
 * comment pagination
 */
commentRouter.get('/', async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;
  const page = req.query.page || 1;
  try {
    const result = await commentService.getCommentsByLesson(teacherId, courseId, lessonId, page);
    const comments = result.body.hits.hits.map((current) => current._source);
    res.status(200).json({
      comments: comments,
      total: result.body.hits.total
    });
  } catch (error) {
    console.error('error:', error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/lesson/:lessonId/comment');
});

/**
 * create comment
 */
commentRouter.post('/', async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;
  const userId = res.locals.user.id;
  const commentId = cassandraTypes.TimeUuid.now();
  const content = req.body.content;
  const newComment = {
    teacherId: teacherId,
    courseId: courseId,
    lessonId: lessonId,
    userId: userId,
    commentId: commentId,
    content: content
  };
  console.log(newComment);
  try {
    const result = await commentService.upsertComment(newComment, void 0, true);
    if (result.wasApplied()) {
      res.status(200).json({ success: 'Create new commemt successfully' });
    } else {
      res.status(400).json({ error: 'Can not create new comment' });
    }
  } catch (error) {
    console.error('error:', error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/lesson/:lessonId/comment');
});

/**
 * edit comment
 */
commentRouter.put('/:commentId', async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;
  const commentId = req.params.commentId;
  const content = req.body.content;
  const userId = res.locals.user.id;
  const newComment = {
    teacherId: teacherId,
    courseId: courseId,
    lessonId: lessonId,
    commentId: commentId,
    content: content,
    userId: userId
  };
  try {
    const result = await commentService.upsertComment(
      newComment,
      ['teacher_id', 'course_id', 'lesson_id', 'id', 'content'],
      false
    );
    if (result.wasApplied()) {
      res.status(200).json({ success: 'Update comment successfully' });
    } else {
      res.status(400).json({ error: 'Can not update this comment' });
    }
  } catch (error) {
    console.error('error:', error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/lesson/:lessonId/comment/:commentId');
});

/**
 * delete comment
 */
commentRouter.delete('/:commentId', async (req, res) => {
  const teacherId = req.params.userId;
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;
  const commentId = req.params.commentId;
  try {
    const result = await commentService.removeComment(teacherId, courseId, lessonId, commentId);
    if (result.wasApplied()) {
      res.status(200).json({
        success: 'Delete comment successfully'
      });
    } else {
      res.status(400).json({ error: 'Can not delete this comment' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unexpected error occured' });
  }
  // res.end('/api/user/:userId/course/:courseId/lesson/:lessonId/comment/:commentId');
});

module.exports = commentRouter;
