import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";
import { getExtendedSettings } from "../../src/defaults";
import { restore } from "../../src/restore";
import { load } from "../../src/load";
import { getStatus } from "../../src/data";
import * as dom from '@testing-library/jest-dom'
import { expect, beforeEach, afterEach, describe, test } from "@jest/globals";

const url1 = "1.gif";
const url2 = "2.gif";
const url100 = "100.gif";
const url200 = "200.gif";
const url400 = "400.gif";
const sizes50 = "50vw";

var outerDiv, settings, instance;

expectExtend(expect);

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

describe("restore for image", () => {
  let img;

  beforeEach(() => {
    outerDiv.appendChild((img = document.createElement("img")));
  });

  afterEach(() => {
    outerDiv.removeChild(img);
    img = null;
  });

  test("when load hasn't been called on the element", () => {
    restore(img);
    expect(img).not.toHaveAttribute("src");
    expect(img).not.toHaveAttribute("srcset");
    expect(img).not.toHaveAttribute("sizes");
  });

  test("with initially empty src and srcset", () => {
    img.setAttribute("data-src", url200);
    img.setAttribute("data-srcset", url400);
    img.setAttribute("data-sizes", sizes50);
    load(img, settings, instance);
    restore(img, settings);
    expect(img).not.toHaveAttribute("src");
    expect(img).not.toHaveAttribute("srcset");
    expect(img).not.toHaveAttribute("sizes");
  });

  test("with initial values in src and srcset", () => {
    img.setAttribute("src", url1);
    img.setAttribute("srcset", url2);
    img.setAttribute("data-srcset", url400);
    img.setAttribute("data-src", url200);
    load(img, settings, instance);
    restore(img, settings);
    expect(img).toHaveAttribute("src", url1);
    expect(img).toHaveAttribute("srcset", url2);
  });

  test("with initial values in src and srcset and empty data-*", () => {
    img.setAttribute("data-src", "");
    img.setAttribute("data-srcset", "");
    img.setAttribute("src", url200);
    img.setAttribute("srcset", url400);
    load(img, settings, instance);
    restore(img, settings);
    expect(img).toHaveAttribute("src", url200);
    expect(img).toHaveAttribute("srcset", url400);
  });

  test("has no classes nor status after restore", () => {
    img.setAttribute("data-src", "");
    load(img, settings, instance);
    restore(img, settings);
    expect(img).not.toHaveClass("applied");
    expect(img).not.toHaveClass("loading");
    expect(img).not.toHaveClass("loaded");
    expect(img).not.toHaveClass("error");
    expect(img).not.toHaveClass("entered");
    expect(img).not.toHaveClass("exited");
    expect(getStatus(img)).toBeNull();
  });
});

describe("restore for picture", () => {
  let picture, source1, source2, img;

  beforeEach(() => {
    outerDiv.appendChild((picture = document.createElement("picture")));
    picture.appendChild((source1 = document.createElement("source")));
    picture.appendChild((source2 = document.createElement("source")));
    picture.appendChild((img = document.createElement("img")));
  });

  afterEach(() => {
    outerDiv.removeChild(picture);
  });

  test("when load hasn't been called on the element", () => {
    restore(img);
    expect(img).not.toHaveAttribute("srcset");
    expect(source1).not.toHaveAttribute("srcset");
    expect(source2).not.toHaveAttribute("srcset");
  });

  test("with initially empty srcset", () => {
    source1.setAttribute("data-srcset", url200);
    source2.setAttribute("data-srcset", url400);
    load(img, settings, instance);
    restore(img, settings);
    expect(source1).not.toHaveAttribute("srcset");
    expect(source2).not.toHaveAttribute("srcset");
  });

  test("with initial value in srcset", () => {
    source1.setAttribute("srcset", url1);
    source1.setAttribute("data-srcset", url200);
    source2.setAttribute("srcset", url2);
    source2.setAttribute("data-srcset", url400);
    load(img, settings, instance);
    restore(img, settings);
    expect(source1).toHaveAttribute("srcset", url1);
    expect(source2).toHaveAttribute("srcset", url2);
  });

  test("with initial value in srcset and empty data-srcset", () => {
    source1.setAttribute("data-srcset", "");
    source2.setAttribute("data-srcset", "");
    source1.setAttribute("srcset", url200);
    source2.setAttribute("srcset", url400);
    load(img, settings, instance);
    restore(img, settings);
    expect(source1).toHaveAttribute("srcset", url200);
    expect(source2).toHaveAttribute("srcset", url400);
  });

  test("has no classes nor status after restore", () => {
    img.setAttribute("data-src", url100);
    source1.setAttribute("data-srcset", url200);
    source2.setAttribute("data-srcset", url400);
    load(img, settings, instance);
    restore(img, settings);
    expect(img).not.toHaveClass("applied");
    expect(img).not.toHaveClass("loading");
    expect(img).not.toHaveClass("loaded");
    expect(img).not.toHaveClass("error");
    expect(img).not.toHaveClass("entered");
    expect(img).not.toHaveClass("exited");
    expect(getStatus(img)).toBeNull();
  });
});

describe("restore for iframe", () => {
  let iframe;
  const srcToLoad = "http://www.google.it";
  const preloadedSrc = srcToLoad + "/doodle";

  beforeEach(() => {
    outerDiv.appendChild((iframe = document.createElement("iframe")));
  });

  afterEach(() => {
    outerDiv.removeChild(iframe);
    iframe = null;
  });

  test("when load hasn't been called on the element", () => {
    restore(iframe);
    expect(iframe).not.toHaveAttribute("srcset");
  });

  test("with initially empty src", () => {
    iframe.setAttribute("data-src", srcToLoad);
    load(iframe, settings, instance);
    restore(iframe, settings);
    expect(iframe).not.toHaveAttribute("src");
  });
  test("with initial value in src", () => {
    iframe.setAttribute("src", preloadedSrc);
    iframe.setAttribute("data-src", srcToLoad);
    load(iframe, settings, instance);
    restore(iframe, settings);
    expect(iframe).toHaveAttribute("src", preloadedSrc);
  });

  test("has no classes nor status after restore", () => {
    iframe.setAttribute("data-src", "");
    load(iframe, settings, instance);
    restore(iframe, settings);
    expect(iframe).not.toHaveClass("applied");
    expect(iframe).not.toHaveClass("loading");
    expect(iframe).not.toHaveClass("loaded");
    expect(iframe).not.toHaveClass("error");
    expect(iframe).not.toHaveClass("entered");
    expect(iframe).not.toHaveClass("exited");
    expect(getStatus(iframe)).toBeNull();
  });
});

describe("restore for single background image", () => {
  let innerDiv;

  // Note: BUG in JsDOM doesn't return `url("")` with quotes inside

  beforeEach(() => {
    outerDiv.appendChild((innerDiv = document.createElement("iframe")));
    //innerDiv.llTempImage = document.createElement("iframe");
  });

  afterEach(() => {
    outerDiv.removeChild(innerDiv);
    innerDiv = null;
  });

  test("when load hasn't been called on the element", () => {
    restore(innerDiv);
    expect(innerDiv.style.backgroundImage).toBe("");
  });

  test("with initially empty style attribute", () => {
    innerDiv.setAttribute("data-bg", `url(${url200})`);
    load(innerDiv, settings, instance);
    restore(innerDiv, settings);
    expect(innerDiv.style.backgroundImage).toBe("");
  });
  test("with initial valye in style attribute", () => {
    innerDiv.style.padding = "1px";
    innerDiv.setAttribute("data-bg", `url(${url400})`);
    load(innerDiv, settings, instance);
    restore(innerDiv, settings);
    expect(innerDiv.style.backgroundImage).toBe("");
    expect(innerDiv.style.padding).toBe("1px");
  });
  test("with initially present style and background", () => {
    innerDiv.style.padding = "1px";
    innerDiv.style.backgroundImage = `url(${url400})`;
    innerDiv.setAttribute("data-bg", `url(${url200})`);
    load(innerDiv, settings, instance);
    restore(innerDiv, settings);
    expect(innerDiv.style.backgroundImage).toBe(`url(${url400})`);
  });

  test("has no classes nor status after restore", () => {
    innerDiv.setAttribute("data-bg", `url(${url200})`);
    load(innerDiv, settings, instance);
    restore(innerDiv, settings);
    expect(innerDiv).not.toHaveClass("applied");
    expect(innerDiv).not.toHaveClass("loading");
    expect(innerDiv).not.toHaveClass("loaded");
    expect(innerDiv).not.toHaveClass("error");
    expect(innerDiv).not.toHaveClass("entered");
    expect(innerDiv).not.toHaveClass("exited");
    expect(getStatus(innerDiv)).toBeNull();
  });
});

// TO DO FROM HERE

describe("resetMultiBackground for multiple background image", () => {
  let innerDiv;

  beforeEach(() => {
    outerDiv.appendChild((innerDiv = document.createElement("div")));
  });

  afterEach(() => {
    outerDiv.removeChild(innerDiv);
    innerDiv = null;
  });

  test("when load hasn't been called on the element", () => {
    restore(innerDiv);
    expect(innerDiv.style.backgroundImage).toBe("");
  });

  test("with initially empty style attribute", () => {
    innerDiv.setAttribute("data-bg-multi", `url(${url200})`);
    load(innerDiv, settings, instance);
    restore(innerDiv, settings);
    expect(innerDiv.style.backgroundImage).toBe("");
  });

  test("with initially present style attribute", () => {
    innerDiv.setAttribute("data-bg-multi", `url(${url400})`);
    innerDiv.style.padding = "1px";
    load(innerDiv, settings, instance);
    restore(innerDiv, settings);
    expect(innerDiv.style.backgroundImage).toBe("");
    expect(innerDiv.style.padding).toBe("1px");
  });

  test("with initially present style and background", () => {
    innerDiv.setAttribute("data-bg-multi", `url(${url200})`);
    innerDiv.style.padding = "1px";
    innerDiv.style.backgroundImage = `url(${url400})`;
    load(innerDiv, settings, instance);
    restore(innerDiv, settings);
    expect(innerDiv.style.backgroundImage).toBe(`url(${url400})`);
  });

  test("has no classes nor status after restore", () => {
    innerDiv.setAttribute("data-bg-multi", `url(${url200})`);
    load(innerDiv, settings, instance);
    restore(innerDiv, settings);
    expect(innerDiv).not.toHaveClass("applied");
    expect(innerDiv).not.toHaveClass("loading");
    expect(innerDiv).not.toHaveClass("loaded");
    expect(innerDiv).not.toHaveClass("error");
    expect(innerDiv).not.toHaveClass("entered");
    expect(innerDiv).not.toHaveClass("exited");
    expect(getStatus(innerDiv)).toBeNull();
  });
});

describe("restore for video", () => {
  let video;
  const videoUrlMp4 = "foobar.mp4";
  const videoUrlAvi = "foobar.avi";
  const videoUrlWebm = "foobar.webm";

  beforeEach(() => {
    outerDiv.appendChild((video = document.createElement("video")));
    //JSDOM doesn't have the video.load() method, need to mock it
    video.load = () => {
    };
  });

  afterEach(() => {
    video.load = null;
    outerDiv.removeChild(video);
    video = null;
  });

  test("when load hasn't been called on the element", () => {
    restore(video);
    expect(video).not.toHaveAttribute("src");
  });

  test("with initially empty src", () => {
    video.setAttribute("data-src", videoUrlAvi);
    load(video, settings, instance);
    restore(video, settings);
    expect(video).not.toHaveAttribute("src");
  });

  test("with initial value in src", () => {
    video.setAttribute("src", videoUrlMp4);
    video.setAttribute("data-src", videoUrlAvi);
    load(video, settings, instance);
    restore(video, settings);
    expect(video).toHaveAttribute("src", videoUrlMp4);
  });

  test("with source elements", () => {
    let source1, source2;
    video.appendChild((source1 = document.createElement("source")));
    video.appendChild((source2 = document.createElement("source")));
    video.setAttribute("data-src", videoUrlAvi);
    source1.setAttribute("data-src", videoUrlMp4);
    source2.setAttribute("data-src", videoUrlWebm);
    load(video, settings, instance);
    restore(video, settings);
    expect(video).not.toHaveAttribute("src");
    expect(source1).not.toHaveAttribute("src");
    expect(source2).not.toHaveAttribute("src");
  });

  test("has no classes nor status after restore", () => {
    video.setAttribute("data-src", videoUrlAvi);
    load(video, settings, instance);
    restore(video, settings);
    expect(video).not.toHaveClass("applied");
    expect(video).not.toHaveClass("loading");
    expect(video).not.toHaveClass("loaded");
    expect(video).not.toHaveClass("error");
    expect(video).not.toHaveClass("entered");
    expect(video).not.toHaveClass("exited");
    expect(getStatus(video)).toBeNull();
  });
});
