import { runningOnBrowser } from "./environment";

export const addClass = (element, className) => {
  if (!runningOnBrowser) {
    return;
  }
  if (className === "") {
    return;
  }
  element.classList.add(className);
};

export const removeClass = (element, className) => {
  if (!runningOnBrowser) {
    return;
  }
  if (className === "") {
    return;
  }
  element.classList.remove(className);
};
