import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";
import { expect, beforeEach, afterEach, describe, test } from "@jest/globals";

import { cancelLoading } from "../../src/cancelOnExit";
import { getExtendedSettings } from "../../src/defaults";
import { getStatus, setStatus } from "../../src/data";
import { statusLoaded } from "../../src/elementStatus";
import { setSources } from "../../src/set";

expectExtend(expect);

var outerDiv, instance, settings;

beforeEach(() => {
  outerDiv = document.createElement("div");
  settings = getExtendedSettings();
  instance = getFakeInstance();
});

afterEach(() => {
  outerDiv = null;
  settings = null;
  instance = null;
});

describe("Cancel loading on img", () => {
  let img;
  const url1 = "1.gif";
  const url100 = "100.gif";
  const url200 = "200.gif";
  const sizes100 = "100vw";
  const entry = "fake-entry";

  beforeEach(() => {
    outerDiv.appendChild((img = document.createElement("img")));
  });

  afterEach(() => {
    outerDiv.removeChild(img);
    img = null;
  });

  test("Does nothing if cancel_on_exit is false", () => {
    settings.cancel_on_exit = false;
    img.setAttribute("src", url1);
    img.setAttribute("data-src", url200);
    setSources(img, settings);
    cancelLoading(img, entry, settings, instance);
    expect(img).toHaveAttribute("src", url200);
  });

  test("Does nothing if element is not loading", () => {
    img.setAttribute("src", url200);
    setSources(img, settings);
    setStatus(img, statusLoaded);
    cancelLoading(img, entry, settings, instance);
    expect(img).toHaveAttribute("src", url200);
  });

  test("Restores original attributes", () => {
    img.setAttribute("src", url1);
    img.setAttribute("data-src", url100);
    img.setAttribute("data-srcset", url200);
    img.setAttribute("data-sizes", sizes100);
    setSources(img, settings, instance);
    cancelLoading(img, entry, settings, instance);
    expect(img).toHaveAttribute("src", url1);
    expect(img).not.toHaveAttribute("srcset");
    expect(img).not.toHaveAttribute("sizes");
  });

  test("Removes loading class", () => {
    img.setAttribute("src", url200);
    setSources(img, settings);
    cancelLoading(img, entry, settings, instance);
    expect(img.className).toBe("");
  });

  test("Decreases loading count", () => {
    img.setAttribute("src", url200);
    setSources(img, settings, instance);
    cancelLoading(img, entry, settings, instance);
    expect(instance.loadingCount).toBe(0);
  });

  test("Resets internal status", () => {
    img.setAttribute("src", url200);
    setSources(img, settings, instance);
    cancelLoading(img, entry, settings, instance);
    expect(getStatus(img)).toBe(null);
  });

  test("Callbacks are called", () => {
    const cancelCb = jest.fn();
    settings.callback_cancel = cancelCb;
    setSources(img, settings, instance);
    cancelLoading(img, entry, settings, instance);
    expect(cancelCb).toHaveBeenCalledTimes(1);
    expect(cancelCb).toHaveBeenCalledWith(img, entry, instance);
  });
});

describe("Cancel loading on iframe", () => {
  let iframe;
  const iframeSrc = "https://github.com";
  const entry = "fake-entry";

  beforeEach(() => {
    outerDiv.appendChild((iframe = document.createElement("iframe")));
  });

  afterEach(() => {
    outerDiv.removeChild(iframe);
    iframe = null;
  });

  test("Doesn't cancel loading", () => {
    iframe.setAttribute("data-src", iframeSrc);
    setSources(iframe, settings, instance);
    cancelLoading(iframe, entry, settings, instance);
    expect(iframe).toHaveAttribute("src", iframeSrc);
  });
});
