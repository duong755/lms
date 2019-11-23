import { types } from 'cassandra-driver';
import dayjs from 'dayjs';

import { randomName, randomNumber } from '../helpers/random';
import { closeConnection } from '../helpers/close';
import { upsertExam, getExamsByCourse, getExamById, removeExam } from '../../server/services/Exam';

const TTL = Number(process.env.TTL) || 30;

const randomTeacherId = types.Uuid.random();
const randomCourseId = types.Uuid.random();
const randomExamId = types.TimeUuid.now();
const randomExamTitle = randomName();
const randomExamDuration = dayjs().format('hh:mm');
const randomExamStartAt = Date.now();
const randomExamContent = ' '
  .repeat(30, 80)
  .split('')
  .map(() => ({
    question: randomName(),
    choices: [randomName(), randomName(), randomName(), randomName()],
    point: randomNumber(1, 10),
    answer: randomNumber(0, 3)
  }));

const randomNewExamTitle = randomName();
const randomNewExamContent = ' '
  .repeat(30, 80)
  .split('')
  .map(() => ({
    question: randomName(),
    choices: [randomName(), randomName(), randomName(), randomName()],
    point: randomNumber(1, 10),
    answer: randomNumber(0, 3)
  }));

describe('Exam Services', () => {
  it('upsertExam (insert)', async () => {
    const res = await upsertExam(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        examId: randomExamId,
        title: randomExamTitle,
        content: randomExamContent,
        startAt: randomExamStartAt,
        duration: randomExamDuration
      },
      void 0,
      true,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });

  it('getExamById', async () => {
    const { body } = await getExamById(randomTeacherId, randomCourseId, randomExamId);
    expect(body.found).toBe(true);
  });

  it('getExamByCourse', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getExamsByCourse(randomTeacherId, randomCourseId, 1);
        expect(body.hits.total).toBeGreaterThanOrEqual(1);
        done();
      }, 1000);
    });
  });

  it('upsertExam (update)', async () => {
    const res = await upsertExam(
      {
        teacherId: randomTeacherId,
        courseId: randomCourseId,
        examId: randomExamId,
        title: randomNewExamTitle,
        content: randomNewExamContent,
        startAt: randomExamStartAt,
        duration: randomExamDuration
      },
      void 0,
      false,
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });

  it('removeExam', async () => {
    const res = await removeExam(randomTeacherId, randomCourseId, randomExamId, TTL);
    expect(res.wasApplied()).toBe(true);
  });
});

describe('ExamWork Services', () => {});

afterAll(closeConnection);
