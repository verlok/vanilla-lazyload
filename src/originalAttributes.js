const originalsProperty = "llOriginalAttrs";

export const hasOriginalAttributes = (element) => {
    return !!element[originalsProperty];
};

export const saveOriginalVideoSourceAttributes = (element) => {
    if (hasOriginalAttributes(element)) {
        return;
    }
    const original = {};
    original["src"] = element.getAttribute("src");
    element[originalsProperty] = original;
};

export const saveOriginalVideoAttributes = (element) => {
    if (hasOriginalAttributes(element)) {
        return;
    }
    const original = {};
    original["src"] = element.getAttribute("src");
    original["poster"] = element.getAttribute("poster");
    element[originalsProperty] = original;
};

export const saveOriginalIframeAttributes = (element) => {
    if (hasOriginalAttributes(element)) {
        return;
    }
    const original = {};
    original["src"] = element.getAttribute("src");
    element[originalsProperty] = original;
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

export const saveOriginalBackgroundStyle = (element) => {
    if (hasOriginalAttributes(element)) {
        return;
    }
    const original = {};
    original.backgroundImage = element.style.backgroundImage;
    element[originalsProperty] = original;
}

export const deleteOriginalAttributes = (element) => delete element[originalsProperty];

export const getOriginalAttributes = (element) => element[originalsProperty];
