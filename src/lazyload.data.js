const dataPrefix = "data-";

export const getData = (element, attribute) => {
    return element.getAttribute(dataPrefix + attribute);
}

export const setData = (element, attribute, value) => {
    return element.setAttribute(dataPrefix + attribute, value);
}