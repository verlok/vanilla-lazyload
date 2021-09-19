import expectExtend from "./lib/expectExtend";
import getFakeInstance from "./lib/getFakeInstance";
import { getExtendedSettings } from "../defaults";

import { setSources } from "../set";
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
    const img1 = "1.gif";
    const img2 = "2.gif";
    const img200 = "200.gif";
    const img400 = "400.gif";

    beforeEach(() => {
        outerDiv.appendChild((img = document.createElement("img")));
    });

    afterEach(() => {
        outerDiv.removeChild(img);
        img = null;
    });

    test("with initially empty src and srcset", () => {
        img.setAttribute("data-src", img200);
        img.setAttribute("data-srcset", img400);
        setSources(img, settings, instance);
        resetSources(img);
        expect(img).not.toHaveAttribute("src");
        expect(img).not.toHaveAttributeValue("srcset");
    });

    /* test("with initial values in src and srcset", () => {
      img.setAttribute("data-src", img200);
      img.setAttribute("data-srcset", img400);
      img.setAttribute("src", img1);
      img.setAttribute("srcset", img2);
      setSources(img, settings, instance);
      resetSources(img);
      expect(img).toHaveAttributeValue("src", img1);
      expect(img).toHaveAttributeValue("srcset", img2);
  });
  test("with initial values in src and srcset and empty data-*", () => {
      img.setAttribute("data-src", "");
      img.setAttribute("data-srcset", "");
      img.setAttribute("src", img200);
      img.setAttribute("srcset", img400);
      setSources(img, settings, instance);
      resetSources(img);
      expect(img).toHaveAttributeValue("src", img200);
      expect(img).toHaveAttributeValue("srcset", img400);
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
  const img100 = "100.gif";
  const img200 = "200.gif";

  beforeEach(() => {
      element = document.createElement("div");
      element.llTempImage = document.createElement("img");
  });

  test("with initially empty style attribute", () => {
      element.setAttribute("data-bg", img200);
      setBackground(element, settings, instance);
      // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
      expect(element.style.backgroundImage).toBe(`url(${img200})`);
  });
  test("with initially present style attribute", () => {
      element.setAttribute("data-bg", img100);
      element.style = {
          padding: "1px"
      };
      setBackground(element, settings, instance);
      // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
      expect(element.style.backgroundImage).toBe(`url(${img100})`);
  });
  test("with initially present style and background", () => {
      element.setAttribute("data-bg", img200);
      element.style = {
          padding: "1px",
          backgroundImage: `url(${img100})`
      };
      setBackground(element, settings, instance);
      // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
      expect(element.style.backgroundImage).toBe(`url(${img200})`);
  });
});

describe("resetMultiBackground for multiple background image", () => {
  let element;
  const img100 = "100.gif";
  const img200 = "200.gif";

  beforeEach(() => {
      element = document.createElement("div");
  });

  test("with initially empty style attribute", () => {
      element.setAttribute("data-bg-multi", `url(${img200})`);
      setMultiBackground(element, settings, instance);
      // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
      expect(element.style.backgroundImage).toBe(`url(${img200})`);
  });
  test("with initially present style attribute", () => {
      element.setAttribute("data-bg-multi", `url(${img100})`);
      element.style = {
          padding: "1px"
      };
      setMultiBackground(element, settings, instance);
      // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
      expect(element.style.backgroundImage).toBe(`url(${img100})`);
  });
  test("with initially present style and background", () => {
      element.setAttribute("data-bg-multi", `url(${img200})`);
      element.style = {
          padding: "1px",
          backgroundImage: `url(${img100})`
      };
      setMultiBackground(element, settings, instance);
      // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
      expect(element.style.backgroundImage).toBe(`url(${img200})`);
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
  const img200 = "200.gif";
  const img400 = "400.gif";
  const img1 = "1.gif";

  beforeEach(() => {
      picture = document.createElement("picture");
      picture.appendChild((source1 = document.createElement("source")));
      picture.appendChild((source2 = document.createElement("source")));
      picture.appendChild((img = document.createElement("img")));
  });

  test("with initially empty srcset", () => {
      source1.setAttribute("data-srcset", img200);
      source2.setAttribute("data-srcset", img400);
      setSources(img, settings, instance);
      resetSources(img);
      expect(source1).toHaveAttributeValue("srcset", img200);
      expect(source2).toHaveAttributeValue("srcset", img400);
  });

  test("with initial value in srcset", () => {
      source1.setAttribute("data-srcset", img200);
      source2.setAttribute("data-srcset", img400);
      source1.setAttribute("srcset", img1);
      source2.setAttribute("srcset", img1);
      setSources(img, settings, instance);
      resetSources(img);
      expect(source1).toHaveAttributeValue("srcset", img200);
      expect(source2).toHaveAttributeValue("srcset", img400);
  });

  test("with initial value in srcset and empty data-srcset", () => {
      source1.setAttribute("data-srcset", "");
      source2.setAttribute("data-srcset", "");
      source1.setAttribute("srcset", img200);
      source2.setAttribute("srcset", img400);
      setSources(img, settings, instance);
      resetSources(img);
      expect(source1).toHaveAttributeValue("srcset", img200);
      expect(source2).toHaveAttributeValue("srcset", img400);
  });
});
*/
