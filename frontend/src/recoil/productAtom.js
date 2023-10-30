// recoil/productAtom.js
import { atom } from "recoil";

export const productState = atom({
  key: 'productState',
  default: [],
});

export const searchQueryState = atom({
  key: 'searchQueryState',
  default: '',  // Default value is an empty string
});