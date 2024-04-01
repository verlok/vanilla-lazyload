import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";
import { expect, beforeEach, afterEach, describe, test } from "@jest/globals";

import { load } from "../../src/load";
import { getExtendedSettings } from "../../src/defaults";
import { getStatus } from "../../src/data";
import { statusLoading } from "../../src/elementStatus";

expectExtend(expect);

var outerDiv, settings, instance;

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

describe("load...", () => {
  let img;

  beforeEach(() => {
    outerDiv.appendChild((img = document.createElement("img")));
  });

  afterEach(() => {
    outerDiv.removeChild(img);
    img = null;
  });

  test("status is set", () => {
    load(img, {});
    const status = getStatus(img);
    expect(status).toBe(statusLoading);
  });

  test("callbacks are called", () => {
    const loadingCb = jest.fn();
    settings.callback_loading = loadingCb;
    load(img, settings, instance);
    expect(loadingCb).toHaveBeenCalledTimes(1);
    expect(loadingCb).toHaveBeenCalledWith(img, instance);
  });
});
