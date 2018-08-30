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
        }
    }
};

export default (expect) => {
    expect.extend(extensions);
};