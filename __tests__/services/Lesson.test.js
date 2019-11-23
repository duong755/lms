import { types } from 'cassandra-driver';

import { getLessonsByTeacherAndCourse, getLessonById, upsertLesson, removeLesson } from '../../server/services/Lesson';
import { randomName } from '../helpers/random';
import { closeConnection } from '../helpers/close';

const TTL = Number(process.env.TTL) || 30;

describe('Lesson Services', () => {
  const randomTeacherId = types.Uuid.random();
  const randomCourseId = types.Uuid.random();
  const randomLessonId = types.TimeUuid.now();
  const randomLessonTitle = randomName();
  const randomLessonContent = randomName();

  const randomNewLessonTitle = randomName();
  const randomNewLessonContent = randomName();

  it('upsertLesson (insert)', async () => {
    const res = await upsertLesson(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        id: randomLessonId,
        title: randomLessonTitle,
        content: randomLessonContent
      },
      true,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });

  it('upsertLesson (update)', async () => {
    const res = await upsertLesson(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        id: randomLessonId,
        title: randomNewLessonTitle,
        content: randomNewLessonContent
      },
      false,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });

  it('getLessonById', async () => {
    const { body } = await getLessonById(randomTeacherId, randomCourseId, randomLessonId);
    expect(body.found).toBe(true);
  });

  it('getLessonsByTeacherAndCourse', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getLessonsByTeacherAndCourse(randomTeacherId, randomCourseId);
        expect(body.hits.total).toBeGreaterThanOrEqual(1);
        done();
      }, 1000);
    });
  });

  it('removeLesson', async () => {
    const res = await removeLesson(randomTeacherId, randomCourseId, randomLessonId, TTL);
    expect(res.wasApplied()).toBe(true);
  });
});

afterAll(closeConnection);
