/* entry.isIntersecting needs fallback because is null on some versions of MS Edge, and
   entry.intersectionRatio is not enough alone because it could be 0 on some intersecting elements */
export const isIntersecting = entry =>
	entry.isIntersecting || entry.intersectionRatio > 0;

const validateRootMargin = value => {
  if (typeof value === "number") {
    return value + "px";
  }

  if (typeof value === "string") {
    const isValid = /^(?:-*\d+(?:(?:px +|px$)|%) *)+/.test(value);

    if (isValid) {
      return value;
    }

    throw new Error("Value for `threshold` not valid. It must be specified in pixels or percent.");
  }

  throw new Error("Value type for `threshold` not valid. It must be a number or a string.");
};

export const getObserverSettings = settings => ({
	root: settings.container === document ? null : settings.container,
	rootMargin: validateRootMargin(settings.threshold),
	threshold: 0
});
