/* Creates instance and notifies it through the window element */
const createInstance = function(classObj, options) {
  let event;
  const eventString = "LazyLoad::Initialized";
  const instance = new classObj(options);
  try {
    // Works in modern browsers
    event = new CustomEvent(eventString, { detail: { instance } });
  } catch (err) {
    // Works in Internet Explorer (all versions)
    event = document.createEvent("CustomEvent");
    event.initCustomEvent(eventString, false, false, { instance });
  }
  window.dispatchEvent(event);
};

/* Auto initialization of one or more instances of LazyLoad, depending on the
    options passed in (plain object or an array) */
export const autoInitialize = (classObj, options) => {
  if (!options) {
    return;
  }
  if (!options.length) {
    // Plain object
    createInstance(classObj, options);
  } else {
    // Array of objects
    for (let i = 0, optionsItem; (optionsItem = options[i]); i += 1) {
      createInstance(classObj, optionsItem);
    }
  }
};
