/**
 * @typedef {{ id: string, username: string, email: string, image: Object<string, string> }} UserData
 * @typedef {{ user: UserData }} User
 */

import { createContext } from 'react';

/**
 * @type {React.Context<{ user: UserData, setUser: (u: UserData) => void }>}
 */
const AppUser = createContext({
  user: null,
  setUser: () => {}
});

export default AppUser;
