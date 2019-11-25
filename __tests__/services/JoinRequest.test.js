import { types } from 'cassandra-driver';

import {
  getJoinRequests,
  getJoinRequestById,
  createJoinRequest,
  acceptJoinRequest,
  removeJoinRequest,
  declineJoinRequest
} from '../../server/services/JoinRequest';

import { closeConnection } from '../helpers/close';

const TTL = Number(process.env.TTL) || 30;
describe('JoinRequest Services', () => {
  const randomTeacherId = types.Uuid.random();
  const randomCourseId = types.Uuid.random();
  const randomStudentId = types.Uuid.random();

  it('createJoinRequest', async () => {
    const res = await createJoinRequest(randomTeacherId, randomCourseId, randomStudentId, TTL);
    expect(res.wasApplied()).toBe(true);
  });

  it('getJoinRequestById', async () => {
    const { body } = await getJoinRequestById(randomTeacherId, randomCourseId, randomStudentId);
    expect(body.found).toBe(true);
  });

  it('getJoinRequests', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getJoinRequests(randomTeacherId, randomCourseId, randomStudentId, 1);
        expect(body.hits.total).toBeGreaterThanOrEqual(1);
        done();
      }, 1000);
    });
  });

  it('acceptJoinRequest', async () => {
    await createJoinRequest(randomTeacherId, randomCourseId, randomStudentId, TTL);
    const res = await acceptJoinRequest(randomTeacherId, randomCourseId, randomStudentId, TTL);
    expect(res.wasApplied()).toBe(true);
  });

  it('declineJoinRequest', async () => {
    await createJoinRequest(randomTeacherId, randomCourseId, randomStudentId, TTL);
    const res = await declineJoinRequest(randomTeacherId, randomCourseId, randomStudentId, TTL);
    expect(res.wasApplied()).toBe(true);
  });

  it('removeJoinRequest', async () => {
    await createJoinRequest(randomTeacherId, randomCourseId, randomStudentId, TTL);
    const res = await removeJoinRequest(randomTeacherId, randomCourseId, randomStudentId, TTL);
    expect(res.wasApplied()).toBe(true);
  });
});

afterAll(closeConnection);
