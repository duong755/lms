import { types } from 'cassandra-driver';

import { randomName } from '../helpers/random';
import { closeConnection } from '../helpers/close';
import { upsertExercise, getExerciseById, getExercisesByCourse, removeExercise } from '../../server/services/Exercise';

const TTL = Number(process.env.TTL) || 30;

const randomTeacherId = types.Uuid.random();
const randomCourseId = types.Uuid.random();
const randomExerciseId = types.TimeUuid.now();
const randomExerciseContent = randomName();
const randomExerciseTitle = randomName();
const randomExerciseDeadline = Date.now();

const randomNewExerciseContent = randomName();

describe('Exercise Service', () => {
  it('upsertExercise (insert)', async () => {
    const res = await upsertExercise(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        exerciseId: randomExerciseId,
        content: randomExerciseContent,
        title: randomExerciseTitle,
        deadline: randomExerciseDeadline
      },
      void 0,
      true,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });

  it('getExerciseById', async () => {
    const { body } = await getExerciseById(randomTeacherId, randomCourseId, randomExerciseId);
    expect(body.found).toBe(true);
  });

  it('getExerciseByCourse', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getExercisesByCourse(randomTeacherId, randomCourseId);
        expect(body.hits.total).toBeGreaterThanOrEqual(1);
        done();
      }, 1000);
    });
  });

  it('upsertExercise (update)', async () => {
    const res = await upsertExercise(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        exerciseId: randomExerciseId,
        content: randomNewExerciseContent
      },
      ['teacher_id', 'course_id', 'id', 'content'],
      false,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });

  it('removeExercise', async () => {
    const res = await removeExercise(randomTeacherId, randomCourseId, randomExerciseId);
    expect(res.wasApplied()).toBe(true);
  });
});

afterAll(closeConnection);
