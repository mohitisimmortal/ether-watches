// recoil/adminAtoms.js
import { atom } from 'recoil';

// Initialize the isAdminState atom with an initial value (false for non-admin)
export const isAdminState = atom({
  key: 'isAdminState',
  default: false,
});