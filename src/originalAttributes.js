
export const hasOriginalAttributes = (element) => {
  return !!element.llOriginalAttrs;
};

export const saveOriginalImageAttributes = (element) => {
  if (hasOriginalAttributes(element)) {
      return;
  }
  const original = {};
  original["src"] = element.getAttribute("src");
  original["srcset"] = element.getAttribute("srcset");
  original["sizes"] = element.getAttribute("sizes");
  element.llOriginalAttrs = original;
};