import { types } from 'cassandra-driver';

import { randomName } from '../helpers/random';
import { closeConnection } from '../helpers/close';

import { upsertComment, getCommentsByLesson, removeComment } from '../../server/services/Comment';

const TTL = Number(process.env.TTL) || 30;

describe('Comment Services', () => {
  const randomTeacherId = types.Uuid.random();
  const randomCourseId = types.Uuid.random();
  const randomUserId = types.Uuid.random();
  const randomLessonId = types.TimeUuid.now();
  const randomCommentId = types.TimeUuid.now();
  const randomContent = randomName();

  const randomNewContent = randomName();

  it('upsertComment (insert)', async () => {
    const res = await upsertComment(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        lessonId: randomLessonId,
        userId: randomUserId,
        commentId: randomCommentId,
        content: randomContent
      },
      void 0,
      true,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });

  it('getCommentsByLesson', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getCommentsByLesson(randomTeacherId, randomCourseId, randomLessonId, 1);
        expect(body.hits.total).toBe(1);
        done();
      }, 1000);
    });
  });

  it('upsertComment (update)', async () => {
    const res = await upsertComment(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        lessonId: randomLessonId,
        userId: randomUserId,
        commentId: randomCommentId,
        content: randomNewContent
      },
      void 0,
      false,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });

  it('removeComment', async () => {
    const res = await removeComment(randomTeacherId, randomCourseId, randomLessonId, randomCommentId, TTL);
    expect(res.wasApplied()).toBe(true);
  });
});

afterAll(closeConnection);
