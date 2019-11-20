import { types } from 'cassandra-driver';

import {
  createUser,
  updateEmail,
  updateUserName,
  updateUserPassword,
  updateUserInfo,
  getUserById
} from '../../server/services/User';
import { randomName } from '../helpers/random';
import { closeConnection } from '../helpers/close';

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
    const res = await createUser({
      userId: randomUserId,
      username: randomUsername,
      hashPassword: randomHashPassword,
      email: randomEmail,
      info: randomInfo,
      type: randomType
    });
    expect(res.wasApplied()).toBe(true);
  });

  it('updateEmail', async () => {
    const res = await updateEmail(randomUserId, randomNewEmail);
    expect(res.wasApplied()).toBe(true);
  });

  it('updateUsername', async () => {
    const res = await updateUserName(randomUserId, randomNewUsername);
    expect(res.wasApplied()).toBe(true);
  });

  it('updateUserPassword', async () => {
    const res = await updateUserPassword(randomUserId, randomNewHashPassword);
    expect(res.wasApplied()).toBe(true);
  });

  it('updateUserInfo', async () => {
    const res = await updateUserInfo(randomUserId, randomNewInfo);
    expect(res.wasApplied()).toBe(true);
  });

  it('getUserById', async () => {
    const { body } = await getUserById(randomUserId.toString());
    expect(body._id).toMatch(randomUserId.toString());
  });
});

afterAll(closeConnection);
