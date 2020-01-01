/**
 * @typedef {{ open: boolean, message: React.ReactNode, action: React.ReactNode }} Notification
 */

import { createContext } from 'react';

/**
 * @type {React.Context<{ notification: Notification, setNotification: (n: Notification) => void }>}
 */
const ProfileNotification = createContext({
  notification: {
    open: false,
    message: '',
    action: ''
  },
  setNotification: () => {}
});

export default ProfileNotification;
