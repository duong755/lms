import { types } from 'cassandra-driver';

import {
  createUser,
  updateEmail,
  updateUserName,
  updateUserPassword,
  updateUserInfo,
  getUserById,
  getMultipleUsersById,
  getUserByEmail,
  getUserByUsername,
  getUserByEmailOrUsername
} from '../../server/services/User';
import { randomName } from '../helpers/random';
import { closeConnection } from '../helpers/close';

const TTL = Number(process.env.TTL) || 30;

describe('User Services', () => {
  const randomUserId = types.Uuid.random();
  const randomUsername = randomName();
  const randomEmail = `${randomName()}@${randomName()}.${randomName()}`;
  const randomHashPassword = randomName();
  const [firstInfoName, secondInfoName, firstInfoValue, secondInfoValue] = [
    randomName(),
    randomName(),
    randomName(),
    randomName()
  ];
  const randomInfo = {
    [firstInfoName]: firstInfoValue,
    [secondInfoName]: secondInfoValue
  };
  const randomType = Math.random() >= 0.5 ? 'teacher' : 'student';

  const randomNewUsername = randomName();
  const randomNewEmail = `${randomName()}@${randomName()}.${randomName()}`;
  const randomNewHashPassword = randomName();
  const newFirstInfoValue = randomName();
  const newSecondInfoValue = void 0;

  const randomNewInfo = {
    [firstInfoName]: newFirstInfoValue,
    [secondInfoName]: newSecondInfoValue
  };

  it('createUser', async () => {
    const res = await createUser(
      {
        userId: randomUserId,
        username: randomUsername,
        hashPassword: randomHashPassword,
        email: randomEmail,
        info: randomInfo,
        type: randomType
      },
      TTL
    );
    expect(res.wasApplied()).toBe(true);
  });

  it('getUserById', async () => {
    const { body } = await getUserById(randomUserId.toString());
    expect(body._id).toBe(randomUserId.toString());
  });

  it('getMultipleUsersById', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getMultipleUsersById([randomUserId.toString()]);
        expect(body.hits.total).toBe(1);
        done();
      }, 1000);
    });
  });

  it('getUserByEmail before update', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getUserByEmail(randomEmail);
        expect(body.hits.total).toBe(1);
        done();
      }, 1000);
    });
  });

  it('getUserByUsername before update', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getUserByUsername(randomUsername);
        expect(body.hits.total).toBe(1);
        done();
      }, 1000);
    });
  });

  it('updateEmail', async () => {
    const res = await updateEmail(randomUserId, randomNewEmail, TTL);
    expect(res.wasApplied()).toBe(true);
  });

  it('updateUsername', async () => {
    const res = await updateUserName(randomUserId, randomNewUsername, TTL);
    expect(res.wasApplied()).toBe(true);
  });

  it('updateUserPassword', async () => {
    const res = await updateUserPassword(randomUserId, randomNewHashPassword, TTL);
    expect(res.wasApplied()).toBe(true);
  });

  it('updateUserInfo', async () => {
    const res = await updateUserInfo(randomUserId, randomNewInfo, TTL);
    expect(res.wasApplied()).toBe(true);
  });

  it('getUserByEmail after update', async () => {
    await new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getUserByEmail(randomNewEmail);
        expect(body.hits.total).toBe(1);
        done();
      }, 1000);
    });
  });
  it('getUserByUsername after update', () => {
    return new Promise((done) => {
      setTimeout(async () => {
        const { body } = await getUserByUsername(randomNewUsername);
        expect(body.hits.total).toBe(1);
        done();
      }, 1000);
    });
  });

  it('getUserByEmailOrUsername', async () => {
    await new Promise((done) => {
      const usernameOrEmail = Math.random() > 0.5 ? randomNewUsername : randomNewEmail;
      setTimeout(async () => {
        const { body } = await getUserByEmailOrUsername(usernameOrEmail);
        expect(body.hits.total).toBe(1);
        done();
      }, 1000);
    });
  });
});

afterAll(closeConnection);
