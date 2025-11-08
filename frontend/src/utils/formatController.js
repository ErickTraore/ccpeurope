//File: frontend/src/utils/formatController.js

let resetFormat = () => {};

export const setResetFormat = (fn) => {
  resetFormat = fn;
};

export const triggerFormatReset = () => {
  resetFormat();
};
