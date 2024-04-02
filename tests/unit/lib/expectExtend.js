const extensions = {
  toHaveAttributeValue: (element, attributeName, valueToVerify) => {
    const actualValue = element.getAttribute(attributeName);
    const pass = actualValue === valueToVerify;
    return pass ? {
      message: () => `${element.tagName} has attribute "${attributeName}" set to "${valueToVerify}"`,
      pass: true
    } : {
      message: () => `expected ${element.tagName} to have attribute "${attributeName}" set to "${valueToVerify}", received "${actualValue}"`,
      pass: false
    };
  },
  toHaveAttribute: (element, attributeName) => {
    const pass = element.hasAttribute(attributeName);
    return pass ? {
      message: () => `${element.tagName} has attribute "${attributeName}"" with value "${element.getAttribute(attributeName)}"`,
      pass: true
    } : {
      message: () => `expected ${element.tagName} to have attribute "${attributeName}"`,
      pass: false
    };
  },
  toHaveClassName: (element, className) => {
    const pass = element.classList.contains(className);
    return pass ? {
      message: () => `${element.tagName} has class "${className}"`,
      pass: true
    } : {
      message: () => `expected ${element.tagName} to have class "${className}"`,
      pass: false
    };
  }
};


export default (expect) => {
  expect.extend(extensions);
};
