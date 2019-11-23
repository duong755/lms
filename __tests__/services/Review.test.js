import { types } from 'cassandra-driver';

import { getReviews, upsertReview, deleteReview } from '../../server/services/Review';

import { closeConnection } from '../helpers/close';
import { randomName, randomNumber } from '../helpers/random';

const TTL = Number(process.env.TTL) || 30;
describe('Review Services', () => {
  const teacherId = types.Uuid.random();
  const courseId = types.Uuid.random();
  const studentId = types.Uuid.random();
  const content = randomName();
  const star = randomNumber(1, 5);

  it('getReviews', async () => {
    const res = await getReviews(teacherId, courseId);
    expect(res.body.hits).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        hits: expect.any(Array)
      })
    );
  });

  it('upsertReview', async () => {
    const res = await upsertReview({ teacherId, courseId, studentId, content, star }, void 0, false, TTL);
    expect(res.wasApplied()).toBe(true);
  });

  it('deleteReview', async () => {
    const res = await deleteReview(teacherId, courseId, studentId);
    expect(res.wasApplied()).toBe(true);
  });
});

afterAll(closeConnection);
