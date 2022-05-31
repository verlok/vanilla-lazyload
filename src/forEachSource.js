const getSourceTags = (parentTag) => {
  let sourceTags = [];
  for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
    if (childTag.tagName === "SOURCE") {
      sourceTags.push(childTag);
    }
  }
  return sourceTags;
};

export const forEachPictureSource = (element, fn) => {
  const parent = element.parentNode;
  if (!parent || parent.tagName !== "PICTURE") {
    return;
  }
  let sourceTags = getSourceTags(parent);
  sourceTags.forEach(fn);
};

export const forEachVideoSource = (element, fn) => {
  let sourceTags = getSourceTags(element);
  sourceTags.forEach(fn);
};