const originalsProperty = "llOriginalAttrs";

export const hasOriginalAttributes = (element) => {
    return !!element[originalsProperty];
};

export const saveOriginalImageAttributes = (element) => {
    if (hasOriginalAttributes(element)) {
        return;
    }
    const original = {};
    original["src"] = element.getAttribute("src");
    original["srcset"] = element.getAttribute("srcset");
    original["sizes"] = element.getAttribute("sizes");
    element[originalsProperty] = original;
};

export const deleteOriginalAttributes = (element) => delete element[originalsProperty];

export const getOriginalAttributes = (element) => element[originalsProperty];
