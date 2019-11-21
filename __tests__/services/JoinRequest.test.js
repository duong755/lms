import { types } from 'cassandra-driver';

import {
  getJoinRequests,
  createJoinRequest,
  acceptJoinRequest,
  declineJoinRequest
} from '../../server/services/JoinRequest';

import { closeConnection } from '../helpers/close';

const TTL = Number(process.env.TTL) || 30;
describe('JoinRequest Services', () => {
  const teacherId = types.Uuid.random();
  const courseId = types.Uuid.random();
  const studentId = types.Uuid.random();

  it('createJoinRequest', async () => {
    const res = await createJoinRequest(teacherId, courseId, studentId, TTL);
    expect(res.wasApplied()).toBe(true);
  });

  it('getJoinRequests', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getJoinRequests(teacherId, courseId, studentId, 1);
        expect(body.hits.total).toBeGreaterThanOrEqual(1);
        done();
      }, 1000);
    });
  });

  it('acceptJoinRequest', async () => {
    await createJoinRequest(teacherId, courseId, studentId, TTL);
    const res = await acceptJoinRequest(teacherId, courseId, studentId, TTL);
    expect(res.wasApplied()).toBe(true);
  });

  it('declineJoinRequest', async () => {
    await createJoinRequest(teacherId, courseId, studentId, TTL);
    const res = await declineJoinRequest(teacherId, courseId, studentId, TTL);
    expect(res.wasApplied()).toBe(true);
  });
});

afterAll(closeConnection);
