// recoil/userAtoms.js
import { atom } from 'recoil';
const userToken = localStorage.getItem('userToken');
const initialUserLoggedInState = !!userToken;

export const userState = atom({
  key: 'userState',
  default: {
    userToken: null,
    username: '',
    email: '',
    role: 'user'
  },
});

export const userLoggedInState = atom({
  key: 'userLoggedInState',
  default: initialUserLoggedInState,
});