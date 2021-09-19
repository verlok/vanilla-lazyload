import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";
import { getExtendedSettings } from "../defaults";

import { resetSources } from "../reset";

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

describe("resetSources for image", () => {
    let img;
    const url1 = "1.gif";
    const url2 = "2.gif";
    const url200 = "200.gif";
    const url400 = "400.gif";
    const sizes50 = "50vw";

    beforeEach(() => {
        outerDiv.appendChild((img = document.createElement("img")));
    });

    afterEach(() => {
        outerDiv.removeChild(img);
        img = null;
    });

    test("with initially empty src and srcset", () => {
        img.setAttribute("src", url200);
        img.setAttribute("srcset", url400);
        img.setAttribute("sizes", sizes50);
        resetSources(img);
        expect(img).not.toHaveAttribute("src");
        expect(img).not.toHaveAttribute("srcset");
        expect(img).not.toHaveAttribute("sizes");
    });

    /* test("with initial values in src and srcset", () => {
      img.setAttribute("data-src", url200);
      img.setAttribute("data-srcset", url400);
      img.setAttribute("src", url1);
      img.setAttribute("srcset", url2);
      setSources(img, settings, instance);
      resetSources(img);
      expect(img).toHaveAttributeValue("src", url1);
      expect(img).toHaveAttributeValue("srcset", url2);
  });
  test("with initial values in src and srcset and empty data-*", () => {
      img.setAttribute("data-src", "");
      img.setAttribute("data-srcset", "");
      img.setAttribute("src", url200);
      img.setAttribute("srcset", url400);
      setSources(img, settings, instance);
      resetSources(img);
      expect(img).toHaveAttributeValue("src", url200);
      expect(img).toHaveAttributeValue("srcset", url400);
  }); */
});

/* describe("resetSources for iframe", () => {
  let iframe;
  let srcToLoad = "http://www.google.it";
  let preloadedSrc = srcToLoad + "/doodle";

  beforeEach(() => {
      iframe = document.createElement("iframe");
  });
  test("with initially empty src", () => {
      iframe.setAttribute("data-src", srcToLoad);
      setSources(iframe, settings, instance);
      resetSources(iframe);
      expect(iframe).toHaveAttributeValue("src", srcToLoad);
  });
  test("with initial value in src", () => {
      iframe.setAttribute("data-src", srcToLoad);
      iframe.setAttribute("src", preloadedSrc);
      setSources(iframe, settings, instance);
      resetSources(iframe);
      expect(iframe).toHaveAttributeValue("src", srcToLoad);
  });
  test("with initial value in src and empty data-src", () => {
      iframe.setAttribute("data-src", "");
      iframe.setAttribute("src", preloadedSrc);
      setSources(iframe, settings, instance);
      resetSources(iframe);
      expect(iframe).toHaveAttributeValue("src", preloadedSrc);
  });
});

describe("resetBackground for single background image", () => {
  let element;
  const url100 = "100.gif";
  const url200 = "200.gif";

  beforeEach(() => {
      element = document.createElement("div");
      element.llTempImage = document.createElement("img");
  });

  test("with initially empty style attribute", () => {
      element.setAttribute("data-bg", url200);
      setBackground(element, settings, instance);
      // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
      expect(element.style.backgroundImage).toBe(`url(${url200})`);
  });
  test("with initially present style attribute", () => {
      element.setAttribute("data-bg", url100);
      element.style = {
          padding: "1px"
      };
      setBackground(element, settings, instance);
      // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
      expect(element.style.backgroundImage).toBe(`url(${url100})`);
  });
  test("with initially present style and background", () => {
      element.setAttribute("data-bg", url200);
      element.style = {
          padding: "1px",
          backgroundImage: `url(${url100})`
      };
      setBackground(element, settings, instance);
      // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
      expect(element.style.backgroundImage).toBe(`url(${url200})`);
  });
});

describe("resetMultiBackground for multiple background image", () => {
  let element;
  const url100 = "100.gif";
  const url200 = "200.gif";

  beforeEach(() => {
      element = document.createElement("div");
  });

  test("with initially empty style attribute", () => {
      element.setAttribute("data-bg-multi", `url(${url200})`);
      setMultiBackground(element, settings, instance);
      // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
      expect(element.style.backgroundImage).toBe(`url(${url200})`);
  });
  test("with initially present style attribute", () => {
      element.setAttribute("data-bg-multi", `url(${url100})`);
      element.style = {
          padding: "1px"
      };
      setMultiBackground(element, settings, instance);
      // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
      expect(element.style.backgroundImage).toBe(`url(${url100})`);
  });
  test("with initially present style and background", () => {
      element.setAttribute("data-bg-multi", `url(${url200})`);
      element.style = {
          padding: "1px",
          backgroundImage: `url(${url100})`
      };
      setMultiBackground(element, settings, instance);
      // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
      expect(element.style.backgroundImage).toBe(`url(${url200})`);
  });
});

describe("resetSources for video", () => {
  let source1, source2, video;
  let videoUrlMp4 = "foobar.mp4";
  let videoUrlAvi = "foobar.avi";
  let videoUrlWebm = "foobar.webm";

  beforeEach(() => {
      video = document.createElement("video");
      video.appendChild(document.createElement("source"));
      video.appendChild(document.createElement("source"));
  });

  test("with initially empty src", () => {
      video.load = jest.fn();
      video.setAttribute("data-src", videoUrlAvi);
      setSources(video, settings, instance);
      resetSources(video);
      expect(video).toHaveAttributeValue("src", videoUrlAvi);
      expect(video.load).toHaveBeenCalled();
  });

  test("with source elements", () => {
      video.load = jest.fn();
      video.setAttribute("data-src", videoUrlAvi);
      video.appendChild((source1 = document.createElement("source")));
      video.appendChild((source2 = document.createElement("source")));
      source1.setAttribute("data-src", videoUrlMp4);
      source2.setAttribute("data-src", videoUrlWebm);
      setSources(video, settings, instance);
      resetSources(video);
      expect(video).toHaveAttributeValue("src", videoUrlAvi);
      expect(source1).toHaveAttributeValue("src", videoUrlMp4);
      expect(source2).toHaveAttributeValue("src", videoUrlWebm);
      expect(video.load).toHaveBeenCalled();
  });
});

describe("resetSources for picture", () => {
  let picture, source1, source2, img;
  const url200 = "200.gif";
  const url400 = "400.gif";
  const url1 = "1.gif";

  beforeEach(() => {
      picture = document.createElement("picture");
      picture.appendChild((source1 = document.createElement("source")));
      picture.appendChild((source2 = document.createElement("source")));
      picture.appendChild((img = document.createElement("img")));
  });

  test("with initially empty srcset", () => {
      source1.setAttribute("data-srcset", url200);
      source2.setAttribute("data-srcset", url400);
      setSources(img, settings, instance);
      resetSources(img);
      expect(source1).toHaveAttributeValue("srcset", url200);
      expect(source2).toHaveAttributeValue("srcset", url400);
  });

  test("with initial value in srcset", () => {
      source1.setAttribute("data-srcset", url200);
      source2.setAttribute("data-srcset", url400);
      source1.setAttribute("srcset", url1);
      source2.setAttribute("srcset", url1);
      setSources(img, settings, instance);
      resetSources(img);
      expect(source1).toHaveAttributeValue("srcset", url200);
      expect(source2).toHaveAttributeValue("srcset", url400);
  });

  test("with initial value in srcset and empty data-srcset", () => {
      source1.setAttribute("data-srcset", "");
      source2.setAttribute("data-srcset", "");
      source1.setAttribute("srcset", url200);
      source2.setAttribute("srcset", url400);
      setSources(img, settings, instance);
      resetSources(img);
      expect(source1).toHaveAttributeValue("srcset", url200);
      expect(source2).toHaveAttributeValue("srcset", url400);
  });
});
*/
