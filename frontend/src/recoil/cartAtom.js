// recoil/cartAtoms.js
import { atom } from 'recoil';

export const cartState = atom({
  key: 'cartState',
  default: [], // Initialize with an empty array to store cart items
});