import { types } from 'cassandra-driver';

import { randomName, randomNumber } from '../helpers/random';
import { closeConnection } from '../helpers/close';
import { upsertExamWork, getExamWorkByStudentId, getExamWorkByExamId } from '../../server/services/ExamWork';

const TTL = Number(process.env.TTL) || 300;

const randomTeacherId = types.Uuid.random();
const randomStudentId = types.Uuid.random();
const randomExamId = types.TimeUuid.now();
const randomCourseId = types.Uuid.random();
const randomContent = ' '
  .repeat(30, 80)
  .split('')
  .map(() => ({
    question: randomName(),
    choices: [randomName(), randomName(), randomName(), randomName()],
    point: randomNumber(1, 10),
    answer: randomNumber(0, 3)
  }));
const randomPoint = randomNumber();
const randomSubmitAt = Date.now();

describe('ExamWork Service', () => {
  it('upsertExamWork', async () => {
    const res = await upsertExamWork(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        examId: randomExamId,
        studentId: randomStudentId,
        content: randomContent,
        point: randomPoint,
        submitAt: randomSubmitAt
      },
      void 0,
      true,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });

  it('getExamWorkByStudentId', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getExamWorkByStudentId(randomTeacherId, randomCourseId, randomExamId, randomStudentId);
        expect(body.found).toBe(true);
        done();
      }, 1000);
    });
  });

  it('getExamWorkByExamId', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getExamWorkByExamId(randomTeacherId, randomCourseId, randomExamId, 1);
        expect(body.hits.total).toBeGreaterThanOrEqual(1);
        done();
      }, 1000);
    });
  });
});

afterAll(closeConnection);
