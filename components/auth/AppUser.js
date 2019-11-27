/**
 * @typedef {{ id: string, username: string, email: string, image: Object<string, string> }} UserData
 * @typedef {{ user: UserData }} User
 */

import { createContext } from 'react';

/**
 * @type {React.Context<User>}
 */
const AppUser = createContext({
  user: null
});

export default AppUser;
