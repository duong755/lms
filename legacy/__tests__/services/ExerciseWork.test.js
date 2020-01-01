import { types } from 'cassandra-driver';

import { randomName, randomNumber } from '../helpers/random';
import { closeConnection } from '../helpers/close';
import {
  upsertExerciseWork,
  getExerciseWorkById,
  getExerciseWorksByExercise
} from '../../server/services/ExerciseWork';

const TTL = Number(process.env.TTL) || 30;

const randomTeacherId = types.Uuid.random();
const randomCourseId = types.Uuid.random();
const randomExerciseId = types.TimeUuid.now();
const randomStudentId = types.Uuid.random();
const randomExerciseContent = randomName();
const randomExercisePoint = randomNumber(80, 100);

describe('ExerciseWork Services', () => {
  it('upsertExerciseWork (insert)', async () => {
    const res = await upsertExerciseWork(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        exerciseId: randomExerciseId,
        studentId: randomStudentId,
        content: randomExerciseContent
      },
      ['teacher_id', 'course_id', 'exercise_id', 'student_id', 'content', 'submit_at'],
      true,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });

  it('getExerciseWorkById', async () => {
    const { body } = await getExerciseWorkById(randomTeacherId, randomCourseId, randomExerciseId, randomStudentId);
    expect(body.found).toBe(true);
  });

  it('getExerciseWorksByExercise', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getExerciseWorksByExercise(randomTeacherId, randomCourseId, randomExerciseId, 1);
        expect(body.hits.total).toBeGreaterThanOrEqual(1);
        done();
      }, 1000);
    });
  });

  it('upsertExerciseWork (update)', async () => {
    const res = await upsertExerciseWork(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        exerciseId: randomExerciseId,
        studentId: randomStudentId,
        point: randomExercisePoint
      },
      ['teacher_id', 'course_id', 'exercise_id', 'student_id', 'point'],
      false,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });
});

afterAll(closeConnection);
