import { safeCallback } from "./callback";
import { load } from "./load";
import { hadStartedLoading, hasEmptyStatus, setStatus } from "./data";
import { cancelLoading } from "./cancelOnExit";
import { unobserveEntered } from "./unobserve";
import { statusEntered } from "./elementStatus";
import { addClass, removeClass } from "./class";

export const onEnter = (element, entry, settings, instance) => {
  const dontLoad = hadStartedLoading(element); /* Save status
        before setting it, to prevent loading it again. Fixes #526. */
  setStatus(element, statusEntered);
  addClass(element, settings.class_entered);
  removeClass(element, settings.class_exited);
  unobserveEntered(element, settings, instance);
  safeCallback(settings.callback_enter, element, entry, instance);
  if (dontLoad) return;
  load(element, settings, instance);
};

export const onExit = (element, entry, settings, instance) => {
  if (hasEmptyStatus(element)) return; //Ignore the first pass, at landing
  addClass(element, settings.class_exited);
  cancelLoading(element, entry, settings, instance);
  safeCallback(settings.callback_exit, element, entry, instance);
};
