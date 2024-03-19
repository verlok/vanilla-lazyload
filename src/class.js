import { supportsClassList } from "./environment";

export const addClass = (element, className) => {
  if (className === "") {
    return;
  }
  if (supportsClassList) {
    element.classList.add(className);
    return;
  }
  element.className += (element.className ? " " : "") + className;
};

export const removeClass = (element, className) => {
  if (className === "") {
    return;
  }
  if (supportsClassList) {
    element.classList.remove(className);
    return;
  }
  element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
};
