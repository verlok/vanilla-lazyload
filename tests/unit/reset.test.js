import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";
import { getExtendedSettings } from "../../src/defaults";
import { expect, beforeEach, afterEach, describe, test } from "@jest/globals";

import { resetSourcesImg } from "../../src/reset";

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

describe("resetSourcesImg", () => {
  let img;
  const url1 = "1.gif";
  const url200 = "200.gif";
  const sizes50 = "50vw";

  beforeEach(() => {
    outerDiv.appendChild((img = document.createElement("img")));
  });

  afterEach(() => {
    outerDiv.removeChild(img);
    img = null;
  });

  test("with initially empty src and srcset", () => {
    img.setAttribute("src", url1);
    img.setAttribute("srcset", url200);
    img.setAttribute("sizes", sizes50);
    resetSourcesImg(img);
    expect(img).not.toHaveAttribute("src");
    expect(img).not.toHaveAttribute("srcset");
    expect(img).not.toHaveAttribute("sizes");
  });
});

